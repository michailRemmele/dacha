import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const UP_MSG_TYPE = 'MOVEMENT_UP';
const LEFT_MSG_TYPE = 'MOVEMENT_LEFT';
const DOWN_MSG_TYPE = 'MOVEMENT_DOWN';
const RIGHT_MSG_TYPE = 'MOVEMENT_RIGHT';

const MOVEMENT_FORCE = 'movementForce';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const MOVEMENT_COMPONENT_NAME = 'movement';

const MOVEMENT_VECTORS = {
  [UP_MSG_TYPE]: new Vector2(0, -1),
  [LEFT_MSG_TYPE]: new Vector2(-1, 0),
  [RIGHT_MSG_TYPE]: new Vector2(1, 0),
  [DOWN_MSG_TYPE]: new Vector2(0, 1),
};

class MovementProcessor extends Processor {
  constructor(options) {
    super();

    this._movementMessageTypes = [ UP_MSG_TYPE, LEFT_MSG_TYPE, DOWN_MSG_TYPE, RIGHT_MSG_TYPE ];
    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const messageBus = options.messageBus;

    const movableGameObjects = this._movementMessageTypes.reduce((storage, messageType) => {
      const messages = messageBus.get(messageType) || [];
      messages.forEach((message) => {
        const gameObjectId = message.gameObject.getId();
        storage[gameObjectId] = storage[gameObjectId] || [];
        storage[gameObjectId].push(message.type);
      });

      return storage;
    }, {});

    this._gameObjectObserver.forEach((gameObject) => {
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const movement = gameObject.getComponent(MOVEMENT_COMPONENT_NAME);

      const movementDirections = movableGameObjects[gameObject.getId()];

      if (!movementDirections) {
        rigidBody.forceVectors[MOVEMENT_FORCE] = new Vector2(0, 0);
        return;
      }

      const vector = new Vector2(0, 0);

      movementDirections.forEach((direction) => {
        vector.add(MOVEMENT_VECTORS[direction]);
      });

      vector.multiplyNumber(movement.speed);
      rigidBody.forceVectors[MOVEMENT_FORCE] = vector;
    });
  }
}

export default MovementProcessor;
