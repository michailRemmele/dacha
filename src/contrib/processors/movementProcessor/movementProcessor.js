import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const MOVEMENT_MSG = 'MOVEMENT';
const POSITION_CHANGED_MSG = 'MOVEMENT_POSITION_CHANGED';

const TRANSFORM_COMPONENT_NAME = 'transform';
const MOVEMENT_COMPONENT_NAME = 'movement';

class MovementProcessor extends Processor {
  _degToRad(deg) {
    return deg * Math.PI / 180;
  }

  _getVectorByAngle(angle) {
    const radAngle = this._degToRad(angle);
    return new Vector2(Math.cos(radAngle), Math.sin(radAngle));
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;
    const messageBus = options.messageBus;

    const messages = messageBus.get(MOVEMENT_MSG) || [];
    const gameObjectsMovements = messages.reduce((storage, message) => {
      const { gameObject, directionAngle } = message;
      const gameObjectId = gameObject.getId();

      if (!storage.directionMap[gameObjectId]) {
        storage.gameObjects.push(gameObject);
      }

      storage.directionMap[gameObjectId] = storage.directionMap[gameObjectId] || new Vector2(0, 0);
      storage.directionMap[gameObjectId].add(this._getVectorByAngle(directionAngle));

      return storage;
    }, { directionMap: {}, gameObjects: []});

    gameObjectsMovements.gameObjects.forEach((gameObject) => {
      const vector = gameObjectsMovements.directionMap[gameObject.getId()];

      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const { speed } = gameObject.getComponent(MOVEMENT_COMPONENT_NAME);

      vector.multiplyNumber(speed * deltaTimeInSeconds * (1 / vector.magnitude));

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
