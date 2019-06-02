import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const MOVEMENT_MESSAGE_TYPE = 'MOVEMENT';
const MOVEMENT_UP_MESSAGE_TYPE = 'MOVEMENT_UP';
const MOVEMENT_RIGHT_MESSAGE_TYPE = 'MOVEMENT_RIGHT';
const MOVEMENT_DOWN_MESSAGE_TYPE = 'MOVEMENT_DOWN';
const MOVEMENT_LEFT_MESSAGE_TYPE = 'MOVEMENT_LEFT';
const STOP_MOVEMENT_MESSAGE_TYPE = 'MOVEMENT_STOP';
const FORCE_NAME = 'MOVEMENT_FORCE';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

const MOVEMENT_VECTORS = {
  MOVEMENT_UP: new Vector2(0, -1),
  MOVEMENT_LEFT: new Vector2(-1, 0),
  MOVEMENT_RIGHT: new Vector2(1, 0),
  MOVEMENT_DOWN: new Vector2(0, 1),
  MOVEMENT_STOP: new Vector2(0, 0),
};

const DIRECTIONS = {
  UP: {
    vector: new Vector2(0, -1),
    message: MOVEMENT_UP_MESSAGE_TYPE,
  },
  UP_RIGHT: {
    vector: new Vector2(1, -1),
    message: MOVEMENT_RIGHT_MESSAGE_TYPE,
  },
  RIGHT: {
    vector: new Vector2(1, 0),
    message: MOVEMENT_RIGHT_MESSAGE_TYPE,
  },
  DOWN_RIGHT: {
    vector: new Vector2(1, 1),
    message: MOVEMENT_RIGHT_MESSAGE_TYPE,
  },
  DOWN: {
    vector: new Vector2(0, 1),
    message: MOVEMENT_DOWN_MESSAGE_TYPE,
  },
  DOWN_LEFT: {
    vector: new Vector2(-1, 1),
    message: MOVEMENT_LEFT_MESSAGE_TYPE,
  },
  LEFT: {
    vector: new Vector2(-1, 0),
    message: MOVEMENT_LEFT_MESSAGE_TYPE,
  },
  UP_LEFT: {
    vector: new Vector2(-1, -1),
    message: MOVEMENT_LEFT_MESSAGE_TYPE,
  },
  STOP: {
    vector: new Vector2(0, 0),
    message: STOP_MOVEMENT_MESSAGE_TYPE,
  },
};

class MovementProcessor extends Processor {
  process(options) {
    const messageBus = options.messageBus;

    const messages = messageBus.get(MOVEMENT_MESSAGE_TYPE) || [];
    messages.forEach((message) => {
      const rigidBody = message.gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const vector = new Vector2(0, 0);
      message.actions.forEach((action) => {
        vector.add(MOVEMENT_VECTORS[action]);
      });

      Object.keys(DIRECTIONS).some((name) => {
        if (vector.equals(DIRECTIONS[name].vector)) {
          messageBus.send({
            type: DIRECTIONS[name].message,
            gameObject: message.gameObject,
          });
          return true;
        }
      });

      vector.multiplyNumber(rigidBody.speed);

      rigidBody.forceVectors[FORCE_NAME] = vector;
    });
  }
}

export default MovementProcessor;
