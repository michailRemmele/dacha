import type { System, SystemOptions } from '../../../engine/system';
import type { Entity, EntityObserver } from '../../../engine/entity';
import type { MessageBus, Message } from '../../../engine/message-bus';

import { Collision } from './collision';

const COLLISION_MESSAGE = 'COLLISION';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

interface CollisionMessage extends Message {
  entity1: Entity
  entity2: Entity
  mtv1: unknown
  mtv2: unknown
}

export class CollisionBroadcastSystem implements System {
  private entityObserver: EntityObserver;
  private messageBus: MessageBus;
  private collisionMap: Record<string, Record<string, Collision>>;
  private activeCollisions: Array<Collision>;

  constructor(options: SystemOptions) {
    this.entityObserver = options.createEntityObserver({
      components: [COLLIDER_CONTAINER_COMPONENT_NAME],
    });
    this.messageBus = options.messageBus;

    this.collisionMap = {};
    this.activeCollisions = [];
  }

  mount(): void {
    this.entityObserver.subscribe('onremove', this.handleEntityRemove);
  }

  unmount(): void {
    this.entityObserver.unsubscribe('onremove', this.handleEntityRemove);
  }

  private handleEntityRemove = (entity: Entity): void => {
    const id = entity.getId();

    this.activeCollisions = this.activeCollisions.filter((collision) => {
      if (collision.entity1.getId() !== id && collision.entity2.getId() !== id) {
        return true;
      }

      if (collision.entity2.getId() === id) {
        delete this.collisionMap[collision.entity1.getId()][id];
      }

      this.publishMessage(collision);

      collision.tick();

      return false;
    });

    delete this.collisionMap[id];
  };

  private publishMessage(collision: Collision): void {
    const {
      entity1, entity2, mtv1, mtv2,
    } = collision;
    const message = {
      type: `${COLLISION_MESSAGE}_${collision.getState()}`,
      id: entity1.getId(),
      entity1,
      entity2,
      mtv1,
      mtv2,
    };

    this.messageBus.send(message);
    this.messageBus.send(message, true);
  }

  update(): void {
    this.entityObserver.fireEvents();

    const collisionMessages = this.messageBus.get(COLLISION_MESSAGE) || [];
    collisionMessages.forEach((message) => {
      const {
        entity1, entity2, mtv1, mtv2,
      } = message as CollisionMessage;
      const entity1Id = entity1.getId();
      const entity2Id = entity2.getId();

      this.collisionMap[entity1Id] = this.collisionMap[entity1Id] || {};

      if (!this.collisionMap[entity1Id][entity2Id]) {
        const collision = new Collision(entity1, entity2, mtv1, mtv2);
        this.collisionMap[entity1Id][entity2Id] = collision;
        this.activeCollisions.push(collision);
      } else {
        this.collisionMap[entity1Id][entity2Id].mtv1 = mtv1;
        this.collisionMap[entity1Id][entity2Id].mtv2 = mtv2;
        this.collisionMap[entity1Id][entity2Id].signal();
      }
    });

    this.activeCollisions = this.activeCollisions.filter((collision) => {
      const { entity1, entity2 } = collision;

      this.publishMessage(collision);

      collision.tick();

      if (collision.isFinished()) {
        delete this.collisionMap[entity1.getId()][entity2.getId()];
      }

      return !collision.isFinished();
    });
  }
}
