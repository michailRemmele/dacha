import type { Actor } from '../../engine/actor';
import { RigidBody, Transform } from '../components';
import { VectorOps, type Point } from '../../engine/math-lib';

export class OneWayValidator {
  private ignoredOneWayContacts: Map<Actor, Map<Actor, number>>;
  private oneWayContactUpdateIndex: number;

  constructor() {
    this.ignoredOneWayContacts = new Map();
    this.oneWayContactUpdateIndex = 0;
  }

  private clearOneWayContacts(): void {
    this.ignoredOneWayContacts.forEach((ignoredContacts, oneWayActor) => {
      ignoredContacts.forEach((lastSeenUpdate, otherActor) => {
        if (lastSeenUpdate !== this.oneWayContactUpdateIndex) {
          ignoredContacts.delete(otherActor);
        }
      });

      if (ignoredContacts.size === 0) {
        this.ignoredOneWayContacts.delete(oneWayActor);
      }
    });

    if (this.ignoredOneWayContacts.size === 0) {
      this.oneWayContactUpdateIndex = 0;
    }
  }

  private trackOneWayContact(oneWayActor: Actor, otherActor: Actor): void {
    let ignoredContacts = this.ignoredOneWayContacts.get(oneWayActor);

    if (!ignoredContacts) {
      ignoredContacts = new Map();
      this.ignoredOneWayContacts.set(oneWayActor, ignoredContacts);
    }

    ignoredContacts.set(otherActor, this.oneWayContactUpdateIndex);
  }

  validate(oneWayActor: Actor, otherActor: Actor, normal: Point): boolean {
    if (this.ignoredOneWayContacts.get(oneWayActor)?.has(otherActor)) {
      this.trackOneWayContact(oneWayActor, otherActor);
      return false;
    }

    const rigidBody = oneWayActor.getComponent(RigidBody);
    const transform = oneWayActor.getComponent(Transform);

    const oneWayNormal = VectorOps.rotatePoint(
      rigidBody.oneWayNormal!,
      transform.world.rotation,
    );

    if (VectorOps.dotProduct(oneWayNormal, normal) > 0) {
      return true;
    }

    this.trackOneWayContact(oneWayActor, otherActor);

    return false;
  }

  update(): void {
    this.oneWayContactUpdateIndex += 1;
  }

  lateUpdate(): void {
    this.clearOneWayContacts();
  }
}
