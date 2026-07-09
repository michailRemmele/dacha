import type { Actor } from '../../../engine/actor';
import { RigidBody, Transform } from '../../components';
import { VectorOps, type Point } from '../../../engine/math-lib';

export class OneWayValidator {
  private ignoredOneWayContacts: Map<Actor, Map<Actor, number>>;
  private touchedActors: Set<Actor>;
  private oneWayContactUpdateIndex: number;

  constructor() {
    this.ignoredOneWayContacts = new Map();
    this.touchedActors = new Set();
    this.oneWayContactUpdateIndex = 0;
  }

  private clearOneWayContacts(): void {
    this.touchedActors.forEach((actor) => {
      const ignoredContacts = this.ignoredOneWayContacts.get(actor);

      if (!ignoredContacts) {
        return;
      }

      ignoredContacts.forEach((lastSeenUpdate, otherActor) => {
        if (lastSeenUpdate !== this.oneWayContactUpdateIndex) {
          ignoredContacts.delete(otherActor);
        }
      });

      if (ignoredContacts.size === 0) {
        this.ignoredOneWayContacts.delete(actor);
      }
    });

    if (this.ignoredOneWayContacts.size === 0) {
      this.oneWayContactUpdateIndex = 0;
    }
  }

  private trackOneWayContact(actor: Actor, oneWayActor: Actor): void {
    let ignoredContacts = this.ignoredOneWayContacts.get(actor);

    if (!ignoredContacts) {
      ignoredContacts = new Map();
      this.ignoredOneWayContacts.set(actor, ignoredContacts);
    }

    ignoredContacts.set(oneWayActor, this.oneWayContactUpdateIndex);
  }

  touch(actor: Actor): void {
    this.touchedActors.add(actor);
  }

  shouldBlock(oneWayActor: Actor, otherActor: Actor, normal: Point): boolean {
    if (this.ignoredOneWayContacts.get(otherActor)?.has(oneWayActor)) {
      this.trackOneWayContact(otherActor, oneWayActor);
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

    this.trackOneWayContact(otherActor, oneWayActor);

    return false;
  }

  delete(actor: Actor): void {
    this.ignoredOneWayContacts.delete(actor);
    this.touchedActors.delete(actor);

    this.ignoredOneWayContacts.forEach((ignoredContacts, trackedActor) => {
      ignoredContacts.delete(actor);

      if (ignoredContacts.size === 0) {
        this.ignoredOneWayContacts.delete(trackedActor);
      }
    });
  }

  update(): void {
    this.oneWayContactUpdateIndex += 1;
  }

  lateUpdate(): void {
    this.clearOneWayContacts();
    this.touchedActors.clear();
  }
}
