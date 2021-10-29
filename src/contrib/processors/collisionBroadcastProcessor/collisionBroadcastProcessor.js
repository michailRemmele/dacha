import Processor from '../../../engine/processor/processor';

import Collision from './collision';

const COLLISION_MESSAGE = 'COLLISION';

class CollisionBroadcastProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;

    this._collisionMap = {};
    this._activeCollisions = [];
  }

  _publishMessage(collision, messageBus) {
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

    messageBus.send(message);
    messageBus.send(message, true);
  }

  _processRemovedGameObjects(messageBus) {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const id = gameObject.getId();

      this._activeCollisions = this._activeCollisions.filter((collision) => {
        if (collision.gameObject1.getId() !== id && collision.gameObject2.getId() !== id) {
          return true;
        }

        if (collision.gameObject2.getId() === id) {
          this._collisionMap[collision.gameObject1.getId()][id] = null;
        }

        this._publishMessage(collision, messageBus);

        collision.tick();

        return false;
      });

      this._collisionMap[id] = null;
    });
  }

  process(options) {
    const { messageBus } = options;

    this._processRemovedGameObjects(messageBus);

    const collisionMessages = messageBus.get(COLLISION_MESSAGE) || [];
    collisionMessages.forEach((message) => {
      const {
        gameObject1, gameObject2, mtv1, mtv2,
      } = message;
      const gameObject1Id = gameObject1.getId();
      const gameObject2Id = gameObject2.getId();

      this._collisionMap[gameObject1Id] = this._collisionMap[gameObject1Id] || {};

      if (!this._collisionMap[gameObject1Id][gameObject2Id]) {
        const collision = new Collision(gameObject1, gameObject2, mtv1, mtv2);
        this._collisionMap[gameObject1Id][gameObject2Id] = collision;
        this._activeCollisions.push(collision);
      } else {
        this._collisionMap[gameObject1Id][gameObject2Id].mtv1 = mtv1;
        this._collisionMap[gameObject1Id][gameObject2Id].mtv2 = mtv2;
        this._collisionMap[gameObject1Id][gameObject2Id].signal();
      }
    });

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      const { gameObject1, gameObject2 } = collision;

      this._publishMessage(collision, messageBus);

      collision.tick();

      if (collision.isFinished()) {
        this._collisionMap[gameObject1.getId()][gameObject2.getId()] = null;
      }

      return !collision.isFinished();
    });
  }
}

export default CollisionBroadcastProcessor;
