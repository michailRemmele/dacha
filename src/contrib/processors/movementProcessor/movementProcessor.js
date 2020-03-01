import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const MOVEMENT_MSG = 'MOVEMENT';

const TRANSFORM_COMPONENT_NAME = 'transform';
const MOVEMENT_COMPONENT_NAME = 'movement';

class MovementProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  _degToRad(deg) {
    return deg * Math.PI / 180;
  }

  _fixCalcError(value) {
    return Math.abs(value) < Number.EPSILON ? 0 : value;
  }

  _getVectorByAngle(angle) {
    const radAngle = this._degToRad(angle);
    const x = this._fixCalcError(Math.cos(radAngle));
    const y = this._fixCalcError(Math.sin(radAngle));

    return new Vector2(x, y);
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;
    const messageBus = options.messageBus;

    const messages = messageBus.get(MOVEMENT_MSG) || [];
    const movementVectors = messages.reduce((storage, message) => {
      const { gameObject, directionAngle } = message;
      const gameObjectId = gameObject.getId();

      storage[gameObjectId] = storage[gameObjectId] || new Vector2(0, 0);
      storage[gameObjectId].add(this._getVectorByAngle(directionAngle));

      return storage;
    }, {});

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const { vector, speed, penalty } = gameObject.getComponent(MOVEMENT_COMPONENT_NAME);
      vector.multiplyNumber(0);

      const movementVector = movementVectors[gameObjectId];
      if (!movementVector || (movementVector.x === 0 && movementVector.y === 0)) {
        return;
      }

      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const resultingSpeed = penalty < speed ? speed - penalty : 0;

      movementVector.multiplyNumber(
        resultingSpeed * deltaTimeInSeconds * (1 / movementVector.magnitude)
      );
      vector.add(movementVector);

      transform.offsetX = transform.offsetX + vector.x;
      transform.offsetY = transform.offsetY + vector.y;
    });
  }
}

export default MovementProcessor;
