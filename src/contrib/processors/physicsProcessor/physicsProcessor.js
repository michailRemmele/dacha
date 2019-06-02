import Vector2 from 'utils/vector/vector2';

import Processor from 'engine/processor/processor';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

class PhysicsProcessor extends Processor {
  constructor(options) {
    super();

    this._scene = options.scene;
    this._gameObjectObserver = options.gameObjectObserver;
  }

  _validateGameObject(gameObject) {
    return this.getComponentList().every((component) => {
      return !!gameObject.getComponent(component);
    });
  }

  getComponentList() {
    return [
      RIGID_BODY_COMPONENT_NAME,
    ];
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    const gameObjectsCoordinates = {};

    this._gameObjectObserver.forEach((gameObject) => {
      if (!this._validateGameObject(gameObject))  {
        return;
      }

      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      const forceVectors = rigidBody.forceVectors;

      const forceVector = Object.keys(forceVectors).reduce((resultantForceVector, forceName) => {
        resultantForceVector.add(forceVectors[forceName]);
        return resultantForceVector;
      }, new Vector2(0, 0));

      if (forceVector.x || forceVector.y) {
        const coordinates = this._scene.getGameObjectCoordinates(gameObjectId);

        const movementVector = forceVector.clone();
        movementVector.multiplyNumber(deltaTimeInSeconds);

        const x = coordinates[0] + movementVector.x;
        const y = coordinates[1] + movementVector.y;

        gameObjectsCoordinates[gameObjectId] = [ x, y ];
      }
    });

    Object.keys(gameObjectsCoordinates).forEach((gameObjectId) => {
      const coordinates = gameObjectsCoordinates[gameObjectId];
      this._scene.placeGameObject(coordinates[0], coordinates[1], gameObjectId);
    });
  }
}

export default PhysicsProcessor;
