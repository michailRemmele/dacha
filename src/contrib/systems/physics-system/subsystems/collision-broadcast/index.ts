import type { Actor } from '../../../../../engine/actor';
import type { Vector2 } from '../../../../../engine/math-lib';
import {
  CollisionEnter,
  CollisionStay,
  CollisionLeave,
} from '../../../../events';
import type { Contact, Point } from '../collision-detection/types';

import { Collision } from './collision';
import type { CollisionState } from './collision';

type CollisionStateEvent =
  | typeof CollisionEnter
  | typeof CollisionStay
  | typeof CollisionLeave;

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
    normal: Vector2,
    penetration: number,
    contactPoints: Point[],
  ): void {
    this.collisionMap[actor1.id] = this.collisionMap[actor1.id] || {};

    if (!this.collisionMap[actor1.id][actor2.id]) {
      const collision = new Collision(
        actor1,
        actor2,
        normal,
        penetration,
        contactPoints,
      );
      this.collisionMap[actor1.id][actor2.id] = collision;
      this.activeCollisions.push(collision);
    } else {
      this.collisionMap[actor1.id][actor2.id].normal = normal;
      this.collisionMap[actor1.id][actor2.id].penetration = penetration;
      this.collisionMap[actor1.id][actor2.id].contactPoints = contactPoints;
      this.collisionMap[actor1.id][actor2.id].signal();
    }
  }

  private publishEvent(collision: Collision): void {
    const { actor1, actor2, normal, penetration, contactPoints } = collision;

    actor1.dispatchEvent(STATE_TO_EVENT[collision.getState()], {
      actor: actor2,
      normal,
      penetration,
      contactPoints,
    });
  }

  update(contacts: Contact[]): void {
    contacts.forEach((contact) => {
      const { actor1, actor2, normal, penetration, contactPoints } = contact;

      const normal2 = contact.normal.clone();
      normal2.multiplyNumber(-1);

      this.trackCollision(actor1, actor2, normal, penetration, contactPoints);
      this.trackCollision(actor2, actor1, normal2, penetration, contactPoints);
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
