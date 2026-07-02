import type { Actor } from '../../../../../engine/actor';
import type { Contact } from '../collision-detection/types';

const CONTACT_NORMAL_MIN_DOT = 0.98;
const CONTACT_POINT_MAX_DISTANCE = 0.2;
const CONTACT_POINT_MAX_DISTANCE_SQUARED =
  CONTACT_POINT_MAX_DISTANCE * CONTACT_POINT_MAX_DISTANCE;

export interface ContactState {
  contact: Contact;
  actor1: Actor;
  actor2: Actor;

  normalImpulse0: number;
  normalImpulse1: number;
  tangentImpulse0: number;
  tangentImpulse1: number;

  point0X: number;
  point0Y: number;
  point1X: number;
  point1Y: number;
  pointCount: number;

  normalX: number;
  normalY: number;
  version: number;
}

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

  prepare(contact: Contact): ContactState {
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
      this.clearImpulses(state);
    }

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

  getNormalImpulse(state: ContactState, index: number): number {
    return index === 0 ? state.normalImpulse0 : state.normalImpulse1;
  }

  setNormalImpulse(state: ContactState, index: number, impulse: number): void {
    if (index === 0) {
      state.normalImpulse0 = impulse;
    } else {
      state.normalImpulse1 = impulse;
    }
  }

  getTangentImpulse(state: ContactState, index: number): number {
    return index === 0 ? state.tangentImpulse0 : state.tangentImpulse1;
  }

  setTangentImpulse(state: ContactState, index: number, impulse: number): void {
    if (index === 0) {
      state.tangentImpulse0 = impulse;
    } else {
      state.tangentImpulse1 = impulse;
    }
  }

  clearImpulses(state: ContactState): void {
    state.normalImpulse0 = 0;
    state.normalImpulse1 = 0;
    state.tangentImpulse0 = 0;
    state.tangentImpulse1 = 0;
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
    return {
      contact,
      actor1: contact.actor1,
      actor2: contact.actor2,

      normalImpulse0: 0,
      normalImpulse1: 0,
      tangentImpulse0: 0,
      tangentImpulse1: 0,

      point0X: 0,
      point0Y: 0,
      point1X: 0,
      point1Y: 0,
      pointCount: 0,

      normalX: contact.normal.x,
      normalY: contact.normal.y,
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
        state.point0X,
        state.point0Y,
        contactPoints[0].x,
        contactPoints[0].y,
      )
    ) {
      return false;
    }

    if (
      contactPoints[1] &&
      !this.isPointClose(
        state.point1X,
        state.point1Y,
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
      state.point0X = contactPoints[0].x;
      state.point0Y = contactPoints[0].y;
    }

    if (contactPoints[1]) {
      state.point1X = contactPoints[1].x;
      state.point1Y = contactPoints[1].y;
    }
  }
}
