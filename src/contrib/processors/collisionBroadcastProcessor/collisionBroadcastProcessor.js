import Processor from 'engine/processor/processor';

import Collision from './collision';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

const COLLISION_MESSAGE = 'COLLISION';
const TRIGGER_MESSAGE = 'TRIGGER';

class CollisionBroadcastProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;

    this._collisionMap = {};
    this._activeCollisions = [];
  }

  process(options) {
    const messageBus = options.messageBus;

    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      this._activeCollisions = this._activeCollisions.filter((collision) => {
        return gameObjectId !== collision.gameObject.getId()
          && gameObjectId !== collision.otherGameObject.getId();
      });

      this._collisionMap[gameObjectId] = null;
    });

    const collisionMessages = messageBus.get(COLLISION_MESSAGE) || [];
    const triggerMessages = messageBus.get(TRIGGER_MESSAGE) || [];
    [ collisionMessages, triggerMessages ].forEach((messages) => {
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
    });

    this._activeCollisions = this._activeCollisions.filter((collision) => {
      const { gameObject, otherGameObject } = collision;
      const { isTrigger } = gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);

      messageBus.send({
        type: `${isTrigger ? TRIGGER_MESSAGE : COLLISION_MESSAGE}_${collision.getState()}`,
        id: collision.gameObject.getId(),
        gameObject: gameObject,
        otherGameObject: otherGameObject,
      });

      collision.tick();

      if (collision.isFinished()) {
        this._collisionMap[gameObject.getId()][otherGameObject.getId()] = null;
      }

      return !collision.isFinished();
    });
  }
}

export default CollisionBroadcastProcessor;
