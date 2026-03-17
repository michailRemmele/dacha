import type { Actor } from '../../../../../engine/actor';
import type { Vector2 } from '../../../../../engine/math-lib';
import {
  CollisionEnter,
  CollisionStay,
  CollisionLeave,
} from '../../../../events';
import type { Contact } from '../collision-detection/types';

import { Collision } from './collision';
import type { CollisionState } from './collision';

type CollisionStateEvent = typeof CollisionEnter | typeof CollisionStay | typeof CollisionLeave;

const STATE_TO_EVENT: Record<CollisionState, CollisionStateEvent> = {
  enter: CollisionEnter,
  stay: CollisionStay,
  leave: CollisionLeave,
};

export class CollisionBroadcastSubsystem {
  private collisionMap: Record<string, Record<string, Collision>>;
  private activeCollisions: Collision[];

  constructor() {
    this.collisionMap = {};
    this.activeCollisions = [];
  }

  private trackCollision(
    actor1: Actor,
    actor2: Actor,
    mtv1: Vector2,
    mtv2: Vector2,
  ): void {
    this.collisionMap[actor1.id] = this.collisionMap[actor1.id] || {};

    if (!this.collisionMap[actor1.id][actor2.id]) {
      const collision = new Collision(actor1, actor2, mtv1, mtv2);
      this.collisionMap[actor1.id][actor2.id] = collision;
      this.activeCollisions.push(collision);
    } else {
      this.collisionMap[actor1.id][actor2.id].mtv1 = mtv1;
      this.collisionMap[actor1.id][actor2.id].mtv2 = mtv2;
      this.collisionMap[actor1.id][actor2.id].signal();
    }
  }

  private publishEvent(collision: Collision): void {
    const {
      actor1, actor2, mtv1,
    } = collision;

    actor1.dispatchEvent(STATE_TO_EVENT[collision.getState()], {
      actor: actor2,
      mtv: mtv1,
    });
  }

  update(contacts: Contact[]): void {
    contacts.forEach((contact) => {
      this.trackCollision(
        contact.actor1,
        contact.actor2,
        contact.mtv1,
        contact.mtv2,
      );
      this.trackCollision(
        contact.actor2,
        contact.actor1,
        contact.mtv2,
        contact.mtv1,
      );
    });

    this.activeCollisions = this.activeCollisions.filter((collision) => {
      const { actor1, actor2 } = collision;

      this.publishEvent(collision);

      collision.tick();

      if (collision.isFinished()) {
        delete this.collisionMap[actor1.id][actor2.id];
      }

      return !collision.isFinished();
    });
  }
}
