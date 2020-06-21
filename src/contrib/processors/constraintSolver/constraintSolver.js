import Processor from 'engine/processor/processor';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

class ConstraintSolver extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._processedPairs = {};
  }

  _validateCollision(gameObject1, gameObject2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    return rigidBody1 && !rigidBody1.ghost && !rigidBody1.isPermeable
      && rigidBody2 && !rigidBody2.ghost && !rigidBody2.isPermeable
      && (!rigidBody1.isStatic || !rigidBody2.isStatic);
  }

  _resolveCollision(gameObject1, gameObject2, mtv1, mtv2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    const transform1 = gameObject1.getComponent(TRANSFORM_COMPONENT_NAME);
    const transform2 = gameObject2.getComponent(TRANSFORM_COMPONENT_NAME);

    if (rigidBody1.isStatic) {
      transform2.offsetX += mtv2.x;
      transform2.offsetY += mtv2.y;
    } else if (rigidBody2.isStatic) {
      transform1.offsetX += mtv1.x;
      transform1.offsetY += mtv1.y;
    } else {
      transform1.offsetX += mtv1.x / 2;
      transform1.offsetY += mtv1.y / 2;

      transform2.offsetX += mtv2.x / 2;
      transform2.offsetY += mtv2.y / 2;
    }
  }

  process(options) {
    const messageBus = options.messageBus;

    this._processedPairs = {};

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    [ enterMessages, stayMessages ].forEach((messages) => {
      messages.forEach((message) => {
        const { gameObject1, gameObject2, mtv1, mtv2 } = message;

        const id1 = gameObject1.getId();
        const id2 = gameObject2.getId();

        if (this._processedPairs[id2] && this._processedPairs[id2][id1]) {
          return;
        }

        this._processedPairs[id1] = this._processedPairs[id1] || {};
        this._processedPairs[id1][id2] = true;

        if (!this._validateCollision(gameObject1, gameObject2)) {
          return;
        }

        this._resolveCollision(gameObject1, gameObject2, mtv1, mtv2);
      });
    });
  }
}

export default ConstraintSolver;
