import type { System, SystemOptions } from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus, Message } from '../../../engine/message-bus';

import { Collision } from './collision';

const COLLISION_MESSAGE = 'COLLISION';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

interface CollisionMessage extends Message {
  gameObject1: GameObject
  gameObject2: GameObject
  mtv1: unknown
  mtv2: unknown
}

export class CollisionBroadcastSystem implements System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;
  private collisionMap: Record<string, Record<string, Collision>>;
  private activeCollisions: Array<Collision>;

  constructor(options: SystemOptions) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [COLLIDER_CONTAINER_COMPONENT_NAME],
    });
    this.messageBus = options.messageBus;

    this.collisionMap = {};
    this.activeCollisions = [];
  }

  mount(): void {
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  unmount(): void {
    this.gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);
  }

  private handleGameObjectRemove = (gameObject: GameObject): void => {
    const id = gameObject.getId();

    this.activeCollisions = this.activeCollisions.filter((collision) => {
      if (collision.gameObject1.getId() !== id && collision.gameObject2.getId() !== id) {
        return true;
      }

      if (collision.gameObject2.getId() === id) {
        delete this.collisionMap[collision.gameObject1.getId()][id];
      }

      this.publishMessage(collision);

      collision.tick();

      return false;
    });

    delete this.collisionMap[id];
  };

  private publishMessage(collision: Collision): void {
    const {
      gameObject1, gameObject2, mtv1, mtv2,
    } = collision;
    const message = {
      type: `${COLLISION_MESSAGE}_${collision.getState()}`,
      id: gameObject1.getId(),
      gameObject1,
      gameObject2,
      mtv1,
      mtv2,
    };

    this.messageBus.send(message);
    this.messageBus.send(message, true);
  }

  update(): void {
    this.gameObjectObserver.fireEvents();

    const collisionMessages = this.messageBus.get(COLLISION_MESSAGE) || [];
    collisionMessages.forEach((message) => {
      const {
        gameObject1, gameObject2, mtv1, mtv2,
      } = message as CollisionMessage;
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
    });

    this.activeCollisions = this.activeCollisions.filter((collision) => {
      const { gameObject1, gameObject2 } = collision;

      this.publishMessage(collision);

      collision.tick();

      if (collision.isFinished()) {
        delete this.collisionMap[gameObject1.getId()][gameObject2.getId()];
      }

      return !collision.isFinished();
    });
  }
}
