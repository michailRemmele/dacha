import type { Actor } from '../../../../../engine/actor';
import { RigidBody } from '../../../../components/rigid-body';
import type { Contact } from '../collision-detection/types';

const CONTACT_NORMAL_MIN_DOT = 0.98;
const CONTACT_POINT_MAX_DISTANCE = 0.2;
const CONTACT_POINT_MAX_DISTANCE_SQUARED =
  CONTACT_POINT_MAX_DISTANCE * CONTACT_POINT_MAX_DISTANCE;

export interface ContactPoint {
  positionX: number;
  positionY: number;

  normalImpulse: number;
  tangentImpulse: number;
  biasImpulse: number;

  anchorAX: number;
  anchorAY: number;
  anchorBX: number;
  anchorBY: number;
  normalMass: number;
  tangentMass: number;

  velocityBias: number;
}

export interface ContactState {
  contact: Contact;
  actor1: Actor;
  actor2: Actor;

  bodyA: RigidBody;
  bodyB: RigidBody;
  invMassA: number;
  invInertiaA: number;
  invMassB: number;
  invInertiaB: number;
  normalX: number;
  normalY: number;
  tangentX: number;
  tangentY: number;
  friction: number;
  restitution: number;

  // Two-point block solver cache: the symmetric 2x2 effective-mass matrix K
  // that couples both contact points' normal impulses to both points' normal
  // velocities in one solve, instead of solving each point in isolation.
  //   K = [ k00  k01 ]
  //       [ k01  k11 ]
  // - k00 (= point0.normalMass) is how much point0's own normal impulse
  //   changes point0's own normal velocity.
  // - k11 (= point1.normalMass) is the same thing for point1.
  // - k01 is the cross term: how much a normal impulse applied at point0
  //   changes the normal velocity at point1 (and vice versa, K is symmetric).
  //   This coupling exists because both points belong to the same two rigid
  //   bodies, so a push at one point also rotates/shifts the bodies enough to
  //   affect separation at the other point. k00/k11 already live on the
  //   points because the single-point fallback solver also needs them; k01
  //   has no use outside the block solve, so it lives here instead.
  k01: number;
  determinant: number;
  blockSolvable: boolean;

  active: boolean;
  warmStartAllowed: boolean;
  skipBias: boolean;

  point0: ContactPoint;
  point1: ContactPoint;
  pointCount: number;

  version: number;
}

const createContactPoint = (): ContactPoint => ({
  positionX: 0,
  positionY: 0,

  normalImpulse: 0,
  tangentImpulse: 0,
  biasImpulse: 0,

  anchorAX: 0,
  anchorAY: 0,
  anchorBX: 0,
  anchorBY: 0,
  normalMass: 0,
  tangentMass: 0,
  velocityBias: 0,
});

export class ContactStateManager {
  private stateMap: Map<Actor, Map<Actor, ContactState>>;
  private states: ContactState[];
  private version: number;

  constructor() {
    this.stateMap = new Map();
    this.states = [];
    this.version = 0;
  }

  updateVersion(): void {
    this.version += 1;
  }

  acquire(contact: Contact): ContactState {
    let state = this.get(contact.actor1, contact.actor2);

    if (!state) {
      state = this.createState(contact);
      this.set(contact.actor1, contact.actor2, state);
      this.set(contact.actor2, contact.actor1, state);
      this.states.push(state);
    } else {
      state.contact = contact;
      state.actor1 = contact.actor1;
      state.actor2 = contact.actor2;
    }

    if (!this.canPreserveImpulses(state, contact)) {
      this.clearWarmStartImpulses(state);
    }

    this.clearFrameImpulses(state);
    this.updateContactIdentity(state, contact);
    state.version = this.version;

    return state;
  }

  pruneStaleStates(): void {
    let stateIndex = 0;

    for (const state of this.states) {
      if (state.version === this.version) {
        this.states[stateIndex] = state;
        stateIndex += 1;
        continue;
      }

      this.delete(state.actor1, state.actor2);
      this.delete(state.actor2, state.actor1);
    }

    this.states.length = stateIndex;
  }

  forEach(callback: (state: ContactState) => void): void {
    this.states.forEach(callback);
  }

  clearWarmStartImpulses(state: ContactState): void {
    state.point0.normalImpulse = 0;
    state.point0.tangentImpulse = 0;
    state.point1.normalImpulse = 0;
    state.point1.tangentImpulse = 0;
  }

  private clearFrameImpulses(state: ContactState): void {
    state.point0.biasImpulse = 0;
    state.point1.biasImpulse = 0;
  }

  private get(actor1: Actor, actor2: Actor): ContactState | undefined {
    return this.stateMap.get(actor1)?.get(actor2);
  }

  private set(actor1: Actor, actor2: Actor, state: ContactState): void {
    let actorStates = this.stateMap.get(actor1);

    if (!actorStates) {
      actorStates = new Map();
      this.stateMap.set(actor1, actorStates);
    }

    actorStates.set(actor2, state);
  }

  private delete(actor1: Actor, actor2: Actor): void {
    const actorStates = this.stateMap.get(actor1);

    if (!actorStates) {
      return;
    }

    actorStates.delete(actor2);

    if (actorStates.size === 0) {
      this.stateMap.delete(actor1);
    }
  }

  private createState(contact: Contact): ContactState {
    const rigidBody1 = contact.actor1.getComponent(RigidBody);
    const rigidBody2 = contact.actor2.getComponent(RigidBody);

    return {
      contact,
      actor1: contact.actor1,
      actor2: contact.actor2,

      bodyA: rigidBody1,
      bodyB: rigidBody2,
      invMassA: 0,
      invInertiaA: 0,
      invMassB: 0,
      invInertiaB: 0,
      normalX: contact.normal.x,
      normalY: contact.normal.y,
      tangentX: -contact.normal.y,
      tangentY: contact.normal.x,
      friction: 0,
      restitution: 0,

      k01: 0,
      determinant: 0,
      blockSolvable: false,

      active: false,
      warmStartAllowed: false,
      skipBias: false,

      point0: createContactPoint(),
      point1: createContactPoint(),
      pointCount: 0,

      version: this.version,
    };
  }

  private canPreserveImpulses(state: ContactState, contact: Contact): boolean {
    const contactPoints = contact.contactPoints;

    if (state.pointCount !== contactPoints.length) {
      return false;
    }

    if (
      state.normalX * contact.normal.x + state.normalY * contact.normal.y <
      CONTACT_NORMAL_MIN_DOT
    ) {
      return false;
    }

    if (
      contactPoints[0] &&
      !this.isPointClose(
        state.point0.positionX,
        state.point0.positionY,
        contactPoints[0].x,
        contactPoints[0].y,
      )
    ) {
      return false;
    }

    if (
      contactPoints[1] &&
      !this.isPointClose(
        state.point1.positionX,
        state.point1.positionY,
        contactPoints[1].x,
        contactPoints[1].y,
      )
    ) {
      return false;
    }

    return true;
  }

  private isPointClose(
    point1X: number,
    point1Y: number,
    point2X: number,
    point2Y: number,
  ): boolean {
    const distanceX = point1X - point2X;
    const distanceY = point1Y - point2Y;

    return (
      distanceX * distanceX + distanceY * distanceY <=
      CONTACT_POINT_MAX_DISTANCE_SQUARED
    );
  }

  private updateContactIdentity(state: ContactState, contact: Contact): void {
    const contactPoints = contact.contactPoints;

    state.normalX = contact.normal.x;
    state.normalY = contact.normal.y;
    state.pointCount = contactPoints.length;

    if (contactPoints[0]) {
      state.point0.positionX = contactPoints[0].x;
      state.point0.positionY = contactPoints[0].y;
    }

    if (contactPoints[1]) {
      state.point1.positionX = contactPoints[1].x;
      state.point1.positionY = contactPoints[1].y;
    }
  }
}
