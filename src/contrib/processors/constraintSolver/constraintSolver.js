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

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  _resolveCollision(gameObject1, gameObject2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    if (rigidBody1.isPermeable || rigidBody2.isPermeable) {
      return;
    }

    const previousTransform = this._gameObjectsLastTransform[gameObject1.getId()];
    const transform = gameObject1.getComponent(TRANSFORM_COMPONENT_NAME);

    transform.offsetX = previousTransform.offsetX;
    transform.offsetY = previousTransform.offsetY;
  }

  process(options) {
    const messageBus = options.messageBus;

    this._processAddedGameObjects();

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    [ enterMessages, stayMessages ].forEach((messages) => {
      messages.forEach((message) => {
        const { gameObject, otherGameObject } = message;

        if (!this._validateCollision(gameObject, otherGameObject)) {
          return;
        }

        this._resolveCollision(gameObject, otherGameObject);
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
