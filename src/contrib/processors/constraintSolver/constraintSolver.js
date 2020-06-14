import Processor from 'engine/processor/processor';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

class ConstraintSolver extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectsLastTransform = {};
    this._processedPairs = {};
  }

  _processAddedGameObjects() {
    this._gameObjectObserver.getLastAdded().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

      this._gameObjectsLastTransform[gameObjectId] = transform.clone();
    });
  }

  _validateCollision(gameObject1, gameObject2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    return rigidBody1 && !rigidBody1.ghost && !rigidBody1.isPermeable
      && rigidBody2 && !rigidBody2.ghost && !rigidBody2.isPermeable;
  }

  _resolveCollision(gameObject1, gameObject2, mtv) {
    // const previousTransform = this._gameObjectsLastTransform[gameObject1.getId()];
    // const transform = gameObject1.getComponent(TRANSFORM_COMPONENT_NAME);
    const transform1 = gameObject1.getComponent(TRANSFORM_COMPONENT_NAME);
    const transform2 = gameObject2.getComponent(TRANSFORM_COMPONENT_NAME);

    // transform.offsetX = previousTransform.offsetX;
    // transform.offsetY = previousTransform.offsetY;

    transform1.offsetX -= mtv.x / 2;
    transform1.offsetY -= mtv.y / 2;

    transform2.offsetX += mtv.x / 2;
    transform2.offsetY += mtv.y / 2;
  }

  process(options) {
    const messageBus = options.messageBus;

    this._processAddedGameObjects();

    this._processedPairs = {};

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    [ enterMessages, stayMessages ].forEach((messages) => {
      messages.forEach((message) => {
        const { gameObject, otherGameObject, mtv } = message;

        const id = gameObject.getId();
        const otherId = otherGameObject.getId();

        if (this._processedPairs[otherId] && this._processedPairs[otherId][id]) {
          return;
        }

        this._processedPairs[id] = this._processedPairs[id] || {};
        this._processedPairs[id][otherId] = true;

        if (!this._validateCollision(gameObject, otherGameObject)) {
          return;
        }

        this._resolveCollision(gameObject, otherGameObject, mtv);
      });
    });

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

      this._gameObjectsLastTransform[gameObjectId] = transform.clone();
    });
  }
}

export default ConstraintSolver;
