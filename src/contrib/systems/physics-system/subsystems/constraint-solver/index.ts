import type { Actor } from '../../../../../engine/actor';
import type { FixedUpdateContext } from '../../../../../engine/system';
import {
  MathOps,
  type Point,
  type Vector2,
} from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { Contact } from '../collision-detection/types';
import {
  DEFAULT_SOLVER_ITERATIONS,
  DEFAULT_CONTACT_MAX_ALLOWED_PENETRATION,
  CONTACT_BIAS,
  DEFAULT_MAX_BIAS_VELOCITY,
  RESTITUTION_VELOCITY_THRESHOLD,
  DEFAULT_LINEAR_SLEEP_THRESHOLD,
  PENETRATION_SLEEP_MARGIN,
} from '../../consts';

import {
  ContactStateManager,
  type ContactState,
  type ContactPoint,
} from './contact-state-manager';
import { OneWayValidator } from './one-way-validator';
import {
  getContactFriction,
  getContactRestitution,
  getEffectiveMass,
  getNormalVelocity,
  getTangentVelocity,
  getPrevNormalVelocity,
  getBiasNormalVelocity,
  applyImpulse,
  applyBiasImpulse,
} from './impulse-utils';
import { shouldWakeSleepingContact } from './contact-utils';
import { SleepSupportTracker } from './sleep-support-tracker';

interface ConstraintSolverOptions {
  getGravity: () => Vector2;
  solverIterations?: number;
  maxAllowedPenetration?: number;
  maxBiasVelocity?: number;
  linearSleepThreshold?: number;
}

const BLOCK_SOLVER_MIN_DETERMINANT = 1e-8;
const BLOCK_SOLVER_TOLERANCE = 1e-8;

/**
 * A resting body gains g * dt of downward velocity from gravity before the
 * solver runs. The restitution threshold must be higher than this velocity,
 * otherwise resting contacts may be treated as impacts and keep bouncing.
 *
 * This factor keeps the threshold safely above one frame of gravity while
 * never allowing it to fall below the base threshold.
 */
const RESTITUTION_GRAVITY_THRESHOLD_FACTOR = 2;

export class ConstraintSolver {
  private oneWayValidator: OneWayValidator;
  private contactStateManager: ContactStateManager;
  private sleepSupportTracker: SleepSupportTracker;

  private getGravity: () => Vector2;
  private restitutionThreshold: number;

  private solverIterations: number;
  private maxAllowedPenetration: number;
  private maxBiasVelocity: number;
  private linearSleepThreshold: number;
  private penetrationSleepThreshold: number;

  // Reusable scratch avoiding per-contact allocations in the hot path.
  private flippedNormal: Point;
  private blockImpulse0: number;
  private blockImpulse1: number;

  constructor(options: ConstraintSolverOptions) {
    this.oneWayValidator = new OneWayValidator();
    this.contactStateManager = new ContactStateManager();
    this.sleepSupportTracker = new SleepSupportTracker(options.getGravity);

    this.getGravity = options.getGravity;
    this.restitutionThreshold = RESTITUTION_VELOCITY_THRESHOLD;

    this.solverIterations =
      options.solverIterations ?? DEFAULT_SOLVER_ITERATIONS;
    this.maxAllowedPenetration =
      options.maxAllowedPenetration ?? DEFAULT_CONTACT_MAX_ALLOWED_PENETRATION;
    this.maxBiasVelocity = options.maxBiasVelocity ?? DEFAULT_MAX_BIAS_VELOCITY;
    this.linearSleepThreshold =
      options.linearSleepThreshold ?? DEFAULT_LINEAR_SLEEP_THRESHOLD;
    this.penetrationSleepThreshold =
      this.maxAllowedPenetration + PENETRATION_SLEEP_MARGIN;

    this.flippedNormal = { x: 0, y: 0 };
    this.blockImpulse0 = 0;
    this.blockImpulse1 = 0;
  }

  private validateCollision(actor1: Actor, actor2: Actor): boolean {
    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    if (!rigidBody1 || !rigidBody2) {
      return false;
    }

    if (rigidBody1.disabled || rigidBody2.disabled) {
      return false;
    }

    if (rigidBody1.type === 'static' && rigidBody2.type === 'static') {
      return false;
    }
    return true;
  }

  private validateOneWayContact(contact: Contact): boolean {
    const rigidBody1 = contact.actor1.getComponent(RigidBody);
    const rigidBody2 = contact.actor2.getComponent(RigidBody);

    if (
      rigidBody1.oneWay &&
      rigidBody2.type === 'dynamic' &&
      !this.oneWayValidator.shouldBlock(
        contact.actor1,
        contact.actor2,
        contact.normal,
      )
    ) {
      return false;
    }

    if (!rigidBody2.oneWay || rigidBody1.type !== 'dynamic') {
      return true;
    }

    this.flippedNormal.x = -contact.normal.x;
    this.flippedNormal.y = -contact.normal.y;

    return this.oneWayValidator.shouldBlock(
      contact.actor2,
      contact.actor1,
      this.flippedNormal,
    );
  }

  private validateSleepContact(contact: Contact): boolean {
    const rigidBody1 = contact.actor1.getComponent(RigidBody);
    const rigidBody2 = contact.actor2.getComponent(RigidBody);

    const isDeepContact = contact.penetration > this.penetrationSleepThreshold;
    const isFastContact = shouldWakeSleepingContact(
      contact,
      this.linearSleepThreshold,
    );

    if (!isDeepContact && !isFastContact) {
      this.sleepSupportTracker.trackContact(contact);
    }

    if (rigidBody1.sleeping && rigidBody2.sleeping) {
      return false;
    }

    if (
      (rigidBody1.sleeping || rigidBody2.sleeping) &&
      (isDeepContact || isFastContact)
    ) {
      rigidBody1.wakeUp();
      rigidBody2.wakeUp();
    }

    return true;
  }

  private getPoint(state: ContactState, index: number): ContactPoint {
    return index === 0 ? state.point0 : state.point1;
  }

  private prepareContact(state: ContactState): void {
    const { normal } = state.contact;
    const bodyA = state.actor1.getComponent(RigidBody);
    const bodyB = state.actor2.getComponent(RigidBody);
    const transformA = state.actor1.getComponent(Transform);
    const transformB = state.actor2.getComponent(Transform);

    const invMassA = bodyA.inverseMass;
    const invMassB = bodyB.inverseMass;
    const invInertiaA = bodyA.inverseInertia;
    const invInertiaB = bodyB.inverseInertia;

    state.bodyA = bodyA;
    state.bodyB = bodyB;
    state.invMassA = invMassA;
    state.invInertiaA = invInertiaA;
    state.invMassB = invMassB;
    state.invInertiaB = invInertiaB;
    state.normalX = normal.x;
    state.normalY = normal.y;
    state.tangentX = -normal.y;
    state.tangentY = normal.x;
    state.friction = getContactFriction(bodyA, bodyB);
    state.restitution = getContactRestitution(bodyA, bodyB);
    state.active = invMassA + invMassB + invInertiaA + invInertiaB > 0;

    if (!state.active) {
      return;
    }

    const posAX = transformA.world.position.x;
    const posAY = transformA.world.position.y;
    const posBX = transformB.world.position.x;
    const posBY = transformB.world.position.y;

    let minPrevNormalVelocity = Infinity;

    for (let index = 0; index < state.pointCount; index += 1) {
      const point = this.getPoint(state, index);

      point.anchorAX = point.positionX - posAX;
      point.anchorAY = point.positionY - posAY;
      point.anchorBX = point.positionX - posBX;
      point.anchorBY = point.positionY - posBY;
      point.normalMass = getEffectiveMass(
        invMassA,
        invInertiaA,
        point.anchorAX,
        point.anchorAY,
        invMassB,
        invInertiaB,
        point.anchorBX,
        point.anchorBY,
        state.normalX,
        state.normalY,
      );
      point.tangentMass = getEffectiveMass(
        invMassA,
        invInertiaA,
        point.anchorAX,
        point.anchorAY,
        invMassB,
        invInertiaB,
        point.anchorBX,
        point.anchorBY,
        state.tangentX,
        state.tangentY,
      );
      const prevNormalVelocity = getPrevNormalVelocity(state, point);

      if (prevNormalVelocity < minPrevNormalVelocity) {
        minPrevNormalVelocity = prevNormalVelocity;
      }

      if (
        state.restitution > 0 &&
        -prevNormalVelocity > this.restitutionThreshold
      ) {
        point.velocityBias = -state.restitution * prevNormalVelocity;
      } else {
        point.velocityBias = 0;
      }
    }

    this.prepareBlockSolver(state);
    this.prepareDecisions(state, minPrevNormalVelocity);
  }

  private prepareBlockSolver(state: ContactState): void {
    if (
      state.pointCount !== 2 ||
      state.point0.normalMass === 0 ||
      state.point1.normalMass === 0
    ) {
      state.blockSolvable = false;
      return;
    }

    const { point0, point1 } = state;
    const crossA0 =
      point0.anchorAX * state.normalY - point0.anchorAY * state.normalX;
    const crossB0 =
      point0.anchorBX * state.normalY - point0.anchorBY * state.normalX;
    const crossA1 =
      point1.anchorAX * state.normalY - point1.anchorAY * state.normalX;
    const crossB1 =
      point1.anchorBX * state.normalY - point1.anchorBY * state.normalX;

    state.k01 =
      state.invMassA +
      state.invMassB +
      crossA0 * crossA1 * state.invInertiaA +
      crossB0 * crossB1 * state.invInertiaB;
    state.determinant =
      point0.normalMass * point1.normalMass - state.k01 * state.k01;
    state.blockSolvable =
      Math.abs(state.determinant) >= BLOCK_SOLVER_MIN_DETERMINANT;
  }

  private prepareDecisions(
    state: ContactState,
    minPrevNormalVelocity: number,
  ): void {
    const hasRestitution = state.restitution > 0;
    const isBouncing =
      hasRestitution && -minPrevNormalVelocity > this.restitutionThreshold;
    const eitherSleeping = state.bodyA.sleeping || state.bodyB.sleeping;

    state.warmStartAllowed =
      (!hasRestitution || !isBouncing) && !eitherSleeping;
    state.skipBias =
      isBouncing && (state.invMassA === 0 || state.invMassB === 0);
  }

  private applyWarmStartImpulse(state: ContactState): void {
    if (!state.warmStartAllowed) {
      this.contactStateManager.clearWarmStartImpulses(state);
      return;
    }

    for (let index = 0; index < state.pointCount; index += 1) {
      const point = this.getPoint(state, index);

      if (point.normalImpulse === 0 && point.tangentImpulse === 0) {
        continue;
      }

      applyImpulse(
        state,
        point,
        state.normalX * point.normalImpulse +
          state.tangentX * point.tangentImpulse,
        state.normalY * point.normalImpulse +
          state.tangentY * point.tangentImpulse,
      );
    }
  }

  private applyNormalImpulse(state: ContactState): void {
    if (state.blockSolvable) {
      this.applyBlockNormalImpulse(state);
      return;
    }

    for (let index = 0; index < state.pointCount; index += 1) {
      this.applyPointNormalImpulse(state, index);
    }
  }

  private applyPointNormalImpulse(state: ContactState, index: number): void {
    const point = this.getPoint(state, index);

    if (point.normalMass === 0) {
      return;
    }

    const velocityAlongNormal = getNormalVelocity(state, point);
    const oldImpulse = point.normalImpulse;
    const newImpulse = Math.max(
      oldImpulse +
        (point.velocityBias - velocityAlongNormal) / point.normalMass,
      0,
    );
    point.normalImpulse = newImpulse;

    const impulse = newImpulse - oldImpulse;

    if (impulse === 0) {
      return;
    }

    applyImpulse(
      state,
      point,
      state.normalX * impulse,
      state.normalY * impulse,
    );
  }

  private applyBlockNormalImpulse(state: ContactState): void {
    const { point0, point1 } = state;
    const mass00 = point0.normalMass;
    const mass11 = point1.normalMass;
    const mass01 = state.k01;

    const velocity0 = getNormalVelocity(state, point0) - point0.velocityBias;
    const velocity1 = getNormalVelocity(state, point1) - point1.velocityBias;
    const oldImpulse0 = point0.normalImpulse;
    const oldImpulse1 = point1.normalImpulse;
    const target0 = mass00 * oldImpulse0 + mass01 * oldImpulse1 - velocity0;
    const target1 = mass01 * oldImpulse0 + mass11 * oldImpulse1 - velocity1;

    if (
      !this.solveBlockNormalImpulse(
        mass00,
        mass01,
        mass11,
        target0,
        target1,
        velocity0,
        velocity1,
        oldImpulse0,
        oldImpulse1,
        state.determinant,
      )
    ) {
      this.applyPointNormalImpulse(state, 0);
      this.applyPointNormalImpulse(state, 1);
      return;
    }

    const impulseDelta0 = this.blockImpulse0 - oldImpulse0;
    const impulseDelta1 = this.blockImpulse1 - oldImpulse1;

    point0.normalImpulse = this.blockImpulse0;
    point1.normalImpulse = this.blockImpulse1;

    if (impulseDelta0 !== 0) {
      applyImpulse(
        state,
        point0,
        state.normalX * impulseDelta0,
        state.normalY * impulseDelta0,
      );
    }

    if (impulseDelta1 !== 0) {
      applyImpulse(
        state,
        point1,
        state.normalX * impulseDelta1,
        state.normalY * impulseDelta1,
      );
    }
  }

  /**
   * Solves the normal impulses for both contact points of a two-point
   * manifold together, instead of one at a time.
   *
   * A contact point can only push, never pull (its impulse
   * must stay >= 0), and a point that's already pulling apart on its own
   * shouldn't be pushed at all. Which point(s) actually need pushing this
   * step isn't known upfront, so this tries the possibilities from most to
   * least likely and uses the first one that comes out consistent:
   *  1. Both points push — solve the 2x2 system directly; only valid if both
   *     resulting impulses are non-negative.
   *  2. Only point0 pushes, point1 is left alone — only valid if point1
   *     isn't still closing in without help (that would mean it needed a
   *     push too, contradicting the assumption).
   *  3. Only point1 pushes, point0 is left alone — mirror of case 2.
   *  4. Neither pushes — only valid if both points are already separating
   *     on their own.
   */
  private solveBlockNormalImpulse(
    mass00: number,
    mass01: number,
    mass11: number,
    target0: number,
    target1: number,
    velocity0: number,
    velocity1: number,
    oldImpulse0: number,
    oldImpulse1: number,
    determinant: number,
  ): boolean {
    const bothImpulse0 = (mass11 * target0 - mass01 * target1) / determinant;
    const bothImpulse1 = (mass00 * target1 - mass01 * target0) / determinant;

    if (bothImpulse0 >= 0 && bothImpulse1 >= 0) {
      this.blockImpulse0 = bothImpulse0;
      this.blockImpulse1 = bothImpulse1;
      return true;
    }

    const point0Impulse = target0 / mass00;
    const point0InactiveVelocity =
      velocity1 + mass01 * (point0Impulse - oldImpulse0) - mass11 * oldImpulse1;

    if (
      point0Impulse >= 0 &&
      point0InactiveVelocity >= -BLOCK_SOLVER_TOLERANCE
    ) {
      this.blockImpulse0 = point0Impulse;
      this.blockImpulse1 = 0;
      return true;
    }

    const point1Impulse = target1 / mass11;
    const point1InactiveVelocity =
      velocity0 - mass00 * oldImpulse0 + mass01 * (point1Impulse - oldImpulse1);

    if (
      point1Impulse >= 0 &&
      point1InactiveVelocity >= -BLOCK_SOLVER_TOLERANCE
    ) {
      this.blockImpulse0 = 0;
      this.blockImpulse1 = point1Impulse;
      return true;
    }

    const inactiveVelocity0 =
      velocity0 - mass00 * oldImpulse0 - mass01 * oldImpulse1;
    const inactiveVelocity1 =
      velocity1 - mass01 * oldImpulse0 - mass11 * oldImpulse1;

    if (
      inactiveVelocity0 >= -BLOCK_SOLVER_TOLERANCE &&
      inactiveVelocity1 >= -BLOCK_SOLVER_TOLERANCE
    ) {
      this.blockImpulse0 = 0;
      this.blockImpulse1 = 0;
      return true;
    }

    return false;
  }

  private applyFrictionImpulse(state: ContactState): void {
    for (let index = 0; index < state.pointCount; index += 1) {
      const point = this.getPoint(state, index);

      if (point.tangentMass === 0) {
        continue;
      }

      const maxFrictionImpulse = state.friction * point.normalImpulse;
      const velocityAlongTangent = getTangentVelocity(state, point);
      const oldImpulse = point.tangentImpulse;
      const newImpulse = MathOps.clamp(
        oldImpulse - velocityAlongTangent / point.tangentMass,
        -maxFrictionImpulse,
        maxFrictionImpulse,
      );
      point.tangentImpulse = newImpulse;

      const impulse = newImpulse - oldImpulse;

      if (impulse === 0) {
        continue;
      }

      applyImpulse(
        state,
        point,
        state.tangentX * impulse,
        state.tangentY * impulse,
      );
    }
  }

  private applyBiasImpulse(state: ContactState, deltaTime: number): void {
    const targetBiasVelocity = Math.min(
      (Math.max(state.contact.penetration - this.maxAllowedPenetration, 0) *
        CONTACT_BIAS) /
        deltaTime,
      this.maxBiasVelocity,
    );

    if (targetBiasVelocity === 0) {
      return;
    }

    for (let index = 0; index < state.pointCount; index += 1) {
      const point = this.getPoint(state, index);

      if (point.normalMass === 0) {
        continue;
      }

      const biasVelocityAlongNormal = getBiasNormalVelocity(state, point);
      const oldImpulse = point.biasImpulse;
      const newImpulse = Math.max(
        oldImpulse +
          (targetBiasVelocity - biasVelocityAlongNormal) / point.normalMass,
        0,
      );
      point.biasImpulse = newImpulse;

      const impulse = newImpulse - oldImpulse;

      if (impulse === 0) {
        continue;
      }

      applyBiasImpulse(
        state,
        point,
        state.normalX * impulse,
        state.normalY * impulse,
      );
    }
  }

  update(contacts: Contact[], context: FixedUpdateContext): void {
    this.oneWayValidator.updateVersion();
    this.contactStateManager.updateVersion();
    this.sleepSupportTracker.beginFrame();

    const { deltaTime } = context;

    this.restitutionThreshold = Math.max(
      RESTITUTION_VELOCITY_THRESHOLD,
      RESTITUTION_GRAVITY_THRESHOLD_FACTOR *
        this.getGravity().magnitude *
        deltaTime,
    );

    contacts.forEach((contact) => {
      if (!this.validateCollision(contact.actor1, contact.actor2)) {
        return;
      }
      if (!this.validateOneWayContact(contact)) {
        return;
      }
      if (!this.validateSleepContact(contact)) {
        return;
      }

      const state = this.contactStateManager.acquire(contact);
      this.prepareContact(state);
      this.applyWarmStartImpulse(state);
    });

    this.sleepSupportTracker.wakeUnsupportedBodies();
    this.contactStateManager.pruneStaleStates();

    for (let iteration = 0; iteration < this.solverIterations; iteration += 1) {
      this.contactStateManager.forEach((state) => {
        if (!state.active) {
          return;
        }

        this.applyNormalImpulse(state);
        this.applyFrictionImpulse(state);

        if (!state.skipBias) {
          this.applyBiasImpulse(state, deltaTime);
        }
      });
    }

    this.oneWayValidator.clearOneWayContacts();
    this.sleepSupportTracker.endFrame();
  }
}
