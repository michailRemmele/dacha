import type { Actor } from '../../../../../engine/actor';
import type { Vector2 } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import type { Contact } from '../collision-detection/types';

import { isSleepSupportContact } from './contact-utils';

export class SleepSupportTracker {
  private currentSupportedActors: Set<Actor>;
  private previousSupportedActors: Set<Actor>;

  private getGravity: () => Vector2;

  constructor(getGravity: () => Vector2) {
    this.currentSupportedActors = new Set();
    this.previousSupportedActors = new Set();

    this.getGravity = getGravity;
  }

  beginFrame(): void {
    this.currentSupportedActors.clear();
  }

  trackContact(contact: Contact): void {
    this.trackActor(contact.actor1, contact);
    this.trackActor(contact.actor2, contact);
  }

  wakeUnsupportedBodies(): void {
    this.previousSupportedActors.forEach((actor) => {
      if (this.currentSupportedActors.has(actor)) {
        return;
      }

      const rigidBody = actor.getComponent(RigidBody);
      rigidBody?.wakeUp();
    });
  }

  endFrame(): void {
    const previousSupportedActors = this.previousSupportedActors;

    this.previousSupportedActors = this.currentSupportedActors;
    this.currentSupportedActors = previousSupportedActors;
  }

  private trackActor(actor: Actor, contact: Contact): void {
    const gravity = this.getGravity();

    const rigidBody = actor.getComponent(RigidBody);

    if (
      rigidBody.type !== 'dynamic' ||
      !isSleepSupportContact(contact, actor, gravity)
    ) {
      return;
    }

    this.currentSupportedActors.add(actor);
  }
}
