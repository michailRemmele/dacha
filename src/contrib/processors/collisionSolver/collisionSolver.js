import Processor from 'engine/processor/processor';
import { Vector2 } from 'engine/mathLib';

const ADD_FORCE_MSG = 'ADD_FORCE';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

const REACTION_FORCE = 'reactionForce';

const GRAVITATIONAL_ACCELERATION_STORE_KEY = 'gravitationalAcceleration';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

class CollisionSolver extends Processor {
  constructor(options) {
    super();

    const { gameObjectObserver, store } = options;

    this._store = store;
    this._gameObjectObserver = gameObjectObserver;
  }

  processorDidMount() {
    this._gravitationalAcceleration = this._store.get(GRAVITATIONAL_ACCELERATION_STORE_KEY);
  }

  _addReactionForce(gameObject, messageBus) {
    const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
    const { useGravity, mass } = rigidBody;

    if (useGravity) {
      const reactionForce = new Vector2(REACTION_FORCE_VECTOR_X, REACTION_FORCE_VECTOR_Y);
      reactionForce.multiplyNumber(mass * this._gravitationalAcceleration);

      messageBus.send({
        type: ADD_FORCE_MSG,
        name: REACTION_FORCE,
        value: reactionForce,
        gameObject,
        id: gameObject.getId(),
      }, true);
    }
  }

  _validateCollision(gameObject1, gameObject2) {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME);

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  process(options) {
    const messageBus = options.messageBus;

    const enterMessages = messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = messageBus.get(COLLISION_STAY_MSG) || [];
    [ enterMessages, stayMessages ].forEach((messages) => {
      messages.forEach((message) => {
        const { gameObject, otherGameObject } = message;

        if (!this._validateCollision(gameObject, otherGameObject)) {
          return;
        }

        this._addReactionForce(gameObject, messageBus);
      });
    });
  }
}

export default CollisionSolver;
