import Processor from 'engine/processor/processor';

import Collision from './collision';

const COLLISION_MESSAGE = 'COLLISION';

class CollisionBroadcastProcessor extends Processor {
  constructor() {
    super();

    this._collisionMap = {};
    this._activeCollisions = [];
  }

  process(options) {
    const messageBus = options.messageBus;

    const messages = messageBus.get(COLLISION_MESSAGE) || [];
    messages.forEach((message) => {
      const { gameObject, otherGameObject } = message;
      const gameObjectId = gameObject.getId();
      const otherGameObjectId = otherGameObject.getId();

      this._collisionMap[gameObjectId] = this._collisionMap[gameObjectId] || {};

      if (!this._collisionMap[gameObjectId][otherGameObjectId]) {
        const collision = new Collision(gameObject, otherGameObject);
        this._collisionMap[gameObjectId][otherGameObjectId] = collision;
        this._activeCollisions.push(collision);
      } else {
        this._collisionMap[gameObjectId][otherGameObjectId].signal();
      }
    });

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      messageBus.send({
        type: `${COLLISION_MESSAGE}_${collision.getState()}`,
        gameObject: collision.gameObject,
        otherGameObject: collision.otherGameObject,
      });

      collision.tick();

      if (collision.isFinished()) {
        this._collisionMap[collision.gameObject.getId()][collision.otherGameObject.getId()] = null;
      }

      return !collision.isFinished();
    });
  }
}

export default CollisionBroadcastProcessor;
