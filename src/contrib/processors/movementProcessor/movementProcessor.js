import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const UP_MSG = 'MOVEMENT_UP';
const LEFT_MSG = 'MOVEMENT_LEFT';
const DOWN_MSG = 'MOVEMENT_DOWN';
const RIGHT_MSG = 'MOVEMENT_RIGHT';
const POSITION_CHANGED_MSG = 'MOVEMENT_POSITION_CHANGED';

const TRANSFORM_COMPONENT_NAME = 'transform';
const MOVEMENT_COMPONENT_NAME = 'movement';

const MOVEMENT_VECTORS = {
  [UP_MSG]: new Vector2(0, -1),
  [LEFT_MSG]: new Vector2(-1, 0),
  [RIGHT_MSG]: new Vector2(1, 0),
  [DOWN_MSG]: new Vector2(0, 1),
};

class MovementProcessor extends Processor {
  constructor(options) {
    super();

    this._movementMessageTypes = [ UP_MSG, LEFT_MSG, DOWN_MSG, RIGHT_MSG ];
    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;
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
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const { speed, vector } = gameObject.getComponent(MOVEMENT_COMPONENT_NAME);

      const movementDirections = movableGameObjects[gameObject.getId()];
      vector.multiplyNumber(0);

      if (!movementDirections) {
        return;
      }

      movementDirections.forEach((direction) => {
        vector.add(MOVEMENT_VECTORS[direction]);
      });

      vector.multiplyNumber(speed * deltaTimeInSeconds);

      transform.offsetX = transform.offsetX + vector.x;
      transform.offsetY = transform.offsetY + vector.y;
      messageBus.send({
        type: POSITION_CHANGED_MSG,
        gameObject: gameObject,
      });
    });
  }
}

export default MovementProcessor;
