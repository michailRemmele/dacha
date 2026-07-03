import type { Actor } from '../../../../../engine/actor';
import type { UpdateOptions } from '../../../../../engine/system';
import { MathOps } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { Contact } from '../collision-detection/types';

import {
  ContactStateManager,
  type ContactState,
} from './contact-state-manager';
import { OneWayValidator } from './one-way-validator';
import {
  getContactFriction,
  getContactRestitution,
  getVelocityAlongDirection,
  getEffectiveMass,
  applyImpulse,
  applyBiasImpulse,
} from './impulse-utils';
import { shouldSkipBias, shouldWarmStart } from './contact-utils';

const SOLVER_ITERATIONS = 8;
const CONTACT_BIAS = 0.8;
const CONTACT_MAX_ALLOWED_PENETRATION = 0.1;
const MAX_BIAS_VELOCITY = 120;
const RESTITUTION_VELOCITY_THRESHOLD = 1;

export class ConstraintSolver {
  private oneWayValidator: OneWayValidator;
  private contactStateManager: ContactStateManager;

  constructor() {
    this.oneWayValidator = new OneWayValidator();
    this.contactStateManager = new ContactStateManager();
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

    return this.oneWayValidator.shouldBlock(contact.actor2, contact.actor1, {
      x: -contact.normal.x,
      y: -contact.normal.y,
    });
  }

  private applyWarmStartImpulse(state: ContactState): void {
    if (!shouldWarmStart(state, RESTITUTION_VELOCITY_THRESHOLD)) {
      this.contactStateManager.clearImpulses(state);
      return;
    }

    const { contact } = state;
    const { actor1, actor2, normal, contactPoints } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);
    const inverseMass1 = rigidBody1.inverseMass;
    const inverseMass2 = rigidBody2.inverseMass;
    const inverseInertia1 = rigidBody1.inverseInertia;
    const inverseInertia2 = rigidBody2.inverseInertia;
    const tangentX = -normal.y;
    const tangentY = normal.x;

    contactPoints.forEach((point, index) => {
      const normalImpulse = this.contactStateManager.getNormalImpulse(
        state,
        index,
      );
      const tangentImpulse = this.contactStateManager.getTangentImpulse(
        state,
        index,
      );

      if (normalImpulse === 0 && tangentImpulse === 0) {
        return;
      }

      applyImpulse(
        rigidBody1,
        transform1,
        rigidBody2,
        transform2,
        inverseMass1,
        inverseInertia1,
        inverseMass2,
        inverseInertia2,
        point,
        normal.x * normalImpulse + tangentX * tangentImpulse,
        normal.y * normalImpulse + tangentY * tangentImpulse,
      );
    });
  }

  private applyNormalImpulse(state: ContactState): void {
    const { contact } = state;
    const { actor1, actor2, normal, contactPoints } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);
    const inverseMass1 = rigidBody1.inverseMass;
    const inverseMass2 = rigidBody2.inverseMass;
    const inverseInertia1 = rigidBody1.inverseInertia;
    const inverseInertia2 = rigidBody2.inverseInertia;

    if (inverseMass1 + inverseMass2 + inverseInertia1 + inverseInertia2 === 0) {
      return;
    }

    contactPoints.forEach((point, index) => {
      const effectiveMass = getEffectiveMass(
        inverseMass1,
        inverseInertia1,
        transform1,
        inverseMass2,
        inverseInertia2,
        transform2,
        point,
        normal.x,
        normal.y,
      );

      if (effectiveMass === 0) {
        return;
      }

      const velocityAlongNormal = getVelocityAlongDirection(
        rigidBody1.linearVelocity,
        rigidBody1.angularVelocity,
        transform1,
        rigidBody2.linearVelocity,
        rigidBody2.angularVelocity,
        transform2,
        point,
        normal,
      );
      const prevVelocityAlongNormal = getVelocityAlongDirection(
        rigidBody1._prevLinearVelocity,
        rigidBody1._prevAngularVelocity,
        transform1,
        rigidBody2._prevLinearVelocity,
        rigidBody2._prevAngularVelocity,
        transform2,
        point,
        normal,
      );
      const contactRestitution = getContactRestitution(rigidBody1, rigidBody2);
      const restitution =
        -prevVelocityAlongNormal > RESTITUTION_VELOCITY_THRESHOLD
          ? contactRestitution
          : 0;
      const impulseMagnitudeDelta =
        -(velocityAlongNormal + restitution * prevVelocityAlongNormal) /
        effectiveMass;
      const oldImpulseMagnitude = this.contactStateManager.getNormalImpulse(
        state,
        index,
      );
      const newImpulseMagnitude = Math.max(
        oldImpulseMagnitude + impulseMagnitudeDelta,
        0,
      );
      const impulseMagnitude = newImpulseMagnitude - oldImpulseMagnitude;

      this.contactStateManager.setNormalImpulse(
        state,
        index,
        newImpulseMagnitude,
      );

      if (impulseMagnitude === 0) {
        return;
      }

      applyImpulse(
        rigidBody1,
        transform1,
        rigidBody2,
        transform2,
        inverseMass1,
        inverseInertia1,
        inverseMass2,
        inverseInertia2,
        point,
        normal.x * impulseMagnitude,
        normal.y * impulseMagnitude,
      );
    });
  }

  private applyFrictionImpulse(state: ContactState): void {
    const { contact } = state;
    const { actor1, actor2, normal, contactPoints } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);
    const inverseMass1 = rigidBody1.inverseMass;
    const inverseMass2 = rigidBody2.inverseMass;
    const inverseInertia1 = rigidBody1.inverseInertia;
    const inverseInertia2 = rigidBody2.inverseInertia;

    if (inverseMass1 + inverseMass2 + inverseInertia1 + inverseInertia2 === 0) {
      return;
    }

    const tangentX = -normal.y;
    const tangentY = normal.x;
    const friction = getContactFriction(rigidBody1, rigidBody2);

    contactPoints.forEach((point, index) => {
      const normalImpulseMagnitude = this.contactStateManager.getNormalImpulse(
        state,
        index,
      );
      const maxFrictionImpulseMagnitude = friction * normalImpulseMagnitude;
      const relativeVelocityX =
        rigidBody2.linearVelocity.x -
        rigidBody2.angularVelocity * (point.y - transform2.world.position.y) -
        (rigidBody1.linearVelocity.x -
          rigidBody1.angularVelocity * (point.y - transform1.world.position.y));
      const relativeVelocityY =
        rigidBody2.linearVelocity.y +
        rigidBody2.angularVelocity * (point.x - transform2.world.position.x) -
        (rigidBody1.linearVelocity.y +
          rigidBody1.angularVelocity * (point.x - transform1.world.position.x));
      const effectiveMass = getEffectiveMass(
        inverseMass1,
        inverseInertia1,
        transform1,
        inverseMass2,
        inverseInertia2,
        transform2,
        point,
        tangentX,
        tangentY,
      );

      if (effectiveMass === 0) {
        return;
      }

      const velocityAlongTangent =
        relativeVelocityX * tangentX + relativeVelocityY * tangentY;
      const impulseMagnitudeDelta = -velocityAlongTangent / effectiveMass;
      const oldImpulseMagnitude = this.contactStateManager.getTangentImpulse(
        state,
        index,
      );
      const newImpulseMagnitude = MathOps.clamp(
        oldImpulseMagnitude + impulseMagnitudeDelta,
        -maxFrictionImpulseMagnitude,
        maxFrictionImpulseMagnitude,
      );
      const impulseMagnitude = newImpulseMagnitude - oldImpulseMagnitude;

      this.contactStateManager.setTangentImpulse(
        state,
        index,
        newImpulseMagnitude,
      );

      if (impulseMagnitude === 0) {
        return;
      }

      applyImpulse(
        rigidBody1,
        transform1,
        rigidBody2,
        transform2,
        inverseMass1,
        inverseInertia1,
        inverseMass2,
        inverseInertia2,
        point,
        tangentX * impulseMagnitude,
        tangentY * impulseMagnitude,
      );
    });
  }

  private applyBiasImpulse(
    state: ContactState,
    deltaTimeInSeconds: number,
  ): void {
    const { contact } = state;
    const { actor1, actor2, normal, contactPoints, penetration } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);
    const inverseMass1 = rigidBody1.inverseMass;
    const inverseMass2 = rigidBody2.inverseMass;
    const inverseInertia1 = rigidBody1.inverseInertia;
    const inverseInertia2 = rigidBody2.inverseInertia;

    if (inverseMass1 + inverseMass2 + inverseInertia1 + inverseInertia2 === 0) {
      return;
    }

    const targetBiasVelocity = Math.min(
      (Math.max(penetration - CONTACT_MAX_ALLOWED_PENETRATION, 0) *
        CONTACT_BIAS) /
        deltaTimeInSeconds,
      MAX_BIAS_VELOCITY,
    );

    if (targetBiasVelocity === 0) {
      return;
    }

    contactPoints.forEach((point, index) => {
      const effectiveMass = getEffectiveMass(
        inverseMass1,
        inverseInertia1,
        transform1,
        inverseMass2,
        inverseInertia2,
        transform2,
        point,
        normal.x,
        normal.y,
      );

      if (effectiveMass === 0) {
        return;
      }

      const biasVelocityAlongNormal = getVelocityAlongDirection(
        rigidBody1._biasLinearVelocity,
        rigidBody1._biasAngularVelocity,
        transform1,
        rigidBody2._biasLinearVelocity,
        rigidBody2._biasAngularVelocity,
        transform2,
        point,
        normal,
      );
      const impulseMagnitudeDelta =
        (targetBiasVelocity - biasVelocityAlongNormal) / effectiveMass;
      const oldImpulseMagnitude = this.contactStateManager.getBiasImpulse(
        state,
        index,
      );
      const newImpulseMagnitude = Math.max(
        oldImpulseMagnitude + impulseMagnitudeDelta,
        0,
      );
      const impulseMagnitude = newImpulseMagnitude - oldImpulseMagnitude;

      this.contactStateManager.setBiasImpulse(
        state,
        index,
        newImpulseMagnitude,
      );

      if (impulseMagnitude === 0) {
        return;
      }

      applyBiasImpulse(
        rigidBody1,
        transform1,
        rigidBody2,
        transform2,
        inverseMass1,
        inverseInertia1,
        inverseMass2,
        inverseInertia2,
        point,
        normal.x * impulseMagnitude,
        normal.y * impulseMagnitude,
      );
    });
  }

  update(contacts: Contact[], options: UpdateOptions): void {
    this.oneWayValidator.updateVersion();
    this.contactStateManager.updateVersion();

    const deltaTimeInSeconds = options.deltaTime / 1000;

    contacts.forEach((contact) => {
      if (!this.validateCollision(contact.actor1, contact.actor2)) {
        return;
      }
      if (!this.validateOneWayContact(contact)) {
        return;
      }

      const state = this.contactStateManager.prepare(contact);
      this.applyWarmStartImpulse(state);
    });

    this.contactStateManager.pruneStaleStates();

    for (let iteration = 0; iteration < SOLVER_ITERATIONS; iteration += 1) {
      this.contactStateManager.forEach((state) => {
        this.applyNormalImpulse(state);

        if (!shouldSkipBias(state, RESTITUTION_VELOCITY_THRESHOLD)) {
          this.applyBiasImpulse(state, deltaTimeInSeconds);
        }
      });
    }

    for (let iteration = 0; iteration < SOLVER_ITERATIONS; iteration += 1) {
      this.contactStateManager.forEach((state) => {
        this.applyFrictionImpulse(state);
      });
    }

    this.oneWayValidator.clearOneWayContacts();
  }
}
