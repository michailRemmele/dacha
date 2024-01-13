import type { SystemOptions } from '../../../../../engine/system';
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

type CollisionStateMessage = typeof CollisionEnter | typeof CollisionStay | typeof CollisionLeave;

const STATE_TO_MESSAGE: Record<CollisionState, CollisionStateMessage> = {
  enter: CollisionEnter,
  stay: CollisionStay,
  leave: CollisionLeave,
};

export class CollisionBroadcastSubsystem {
  private scene: Scene;
  private collisionMap: Record<string, Record<string, Collision>>;
  private activeCollisions: Array<Collision>;

  constructor(options: SystemOptions) {
    this.scene = options.scene;

    this.collisionMap = {};
    this.activeCollisions = [];
  }

  mount(): void {
    this.scene.addEventListener(RawCollision, this.handleCollision);
  }

  unmount(): void {
    this.scene.removeEventListener(RawCollision, this.handleCollision);
  }

  private handleCollision = (event: CollisionEvent): void => {
    const {
      gameObject1, gameObject2, mtv1, mtv2,
    } = event;
    const gameObject1Id = gameObject1.getId();
    const gameObject2Id = gameObject2.getId();

    this.collisionMap[gameObject1Id] = this.collisionMap[gameObject1Id] || {};

    if (!this.collisionMap[gameObject1Id][gameObject2Id]) {
      const collision = new Collision(gameObject1, gameObject2, mtv1, mtv2);
      this.collisionMap[gameObject1Id][gameObject2Id] = collision;
      this.activeCollisions.push(collision);
    } else {
      this.collisionMap[gameObject1Id][gameObject2Id].mtv1 = mtv1;
      this.collisionMap[gameObject1Id][gameObject2Id].mtv2 = mtv2;
      this.collisionMap[gameObject1Id][gameObject2Id].signal();
    }
  };

  private publishMessage(collision: Collision): void {
    const {
      gameObject1, gameObject2, mtv1,
    } = collision;

    gameObject1.emit(STATE_TO_MESSAGE[collision.getState()], {
      gameObject: gameObject2,
      mtv: mtv1,
    });
  }

  update(): void {
    this.activeCollisions = this.activeCollisions.filter((collision) => {
      const { gameObject1, gameObject2 } = collision;

      this.publishMessage(collision);

      collision.tick();

      if (collision.isFinished()) {
        delete this.collisionMap[gameObject1.id][gameObject2.id];
      }

      return !collision.isFinished();
    });
  }
}
