import Vector2 from 'utils/vector/vector2';
import Processor from 'engine/processor/processor';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';
const COLLISION_LEAVE_MSG = 'COLLISION_LEAVE';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

const REACTION_FORCE = 'reactionForce';
const GRAVITY_FORCE = 'gravityForce';

class CollisionSolver extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  _addReactionForce(gameObject) {
    const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
    const { forceVectors, useGravity } = rigidBody;

    if (useGravity && !forceVectors[REACTION_FORCE]) {
      forceVectors[REACTION_FORCE] = forceVectors[GRAVITY_FORCE]
        ? forceVectors[GRAVITY_FORCE].clone()
        : new Vector2(0, 0);
      forceVectors[REACTION_FORCE].multiplyNumber(-1);
    }
  }

  _validateCollision(gameObject1, gameObject2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  process(options) {
    const messageBus = options.messageBus;

    const leaveMessages = messageBus.get(COLLISION_LEAVE_MSG) || [];
    leaveMessages.forEach((message) => {
      const { gameObject, otherGameObject } = message;

      if (!this._validateCollision(gameObject, otherGameObject)) {
        return;
      }

      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      rigidBody.forceVectors[REACTION_FORCE] = null;
    });

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    [ enterMessages, stayMessages ].forEach((messages) => {
      messages.forEach((message) => {
        const { gameObject, otherGameObject } = message;

        if (!this._validateCollision(gameObject, otherGameObject)) {
          return;
        }

        this._addReactionForce(gameObject);
      });
    });
  }
}

export default CollisionSolver;
