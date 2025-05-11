import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Scene } from '../../../../../engine/scene';
import {
  Collision as RawCollision,
  CollisionEnter,
  CollisionStay,
  CollisionLeave,
} from '../../../../events';
import type { CollisionEvent } from '../../../../events';

import { Collision } from './collision';
import type { CollisionState } from './collision';

type CollisionStateEvent = typeof CollisionEnter | typeof CollisionStay | typeof CollisionLeave;

const STATE_TO_EVENT: Record<CollisionState, CollisionStateEvent> = {
  enter: CollisionEnter,
  stay: CollisionStay,
  leave: CollisionLeave,
};

export class CollisionBroadcastSubsystem {
  private scene: Scene;
  private collisionMap: Record<string, Record<string, Collision>>;
  private activeCollisions: Array<Collision>;

  constructor(options: SceneSystemOptions) {
    this.scene = options.scene;

    this.collisionMap = {};
    this.activeCollisions = [];

    this.scene.addEventListener(RawCollision, this.handleCollision);
  }

  destroy(): void {
    this.scene.removeEventListener(RawCollision, this.handleCollision);
  }

  private handleCollision = (event: CollisionEvent): void => {
    const {
      actor1, actor2, mtv1, mtv2,
    } = event;

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
  };

  private publishEvent(collision: Collision): void {
    const {
      actor1, actor2, mtv1,
    } = collision;

    actor1.dispatchEvent(STATE_TO_EVENT[collision.getState()], {
      actor: actor2,
      mtv: mtv1,
    });
  }

  update(): void {
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
