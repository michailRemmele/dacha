import Vector2 from 'utils/vector/vector2';

import IOC from 'engine/ioc/ioc';
import Processor from 'engine/processor/processor';

import * as global from 'engine/consts/global';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

class PhysicsProcessor extends Processor {
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

    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    const currentScene = sceneProvider.getCurrentScene();

    const gameObjectsCoordinates = {};

    currentScene.forEachPlacedGameObject((gameObject) => {
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
        const coordinates = currentScene.getGameObjectCoordinates(gameObjectId);

        const movementVector = forceVector.clone();
        movementVector.multiplyNumber(deltaTimeInSeconds);

        const x = coordinates[0] + movementVector.x;
        const y = coordinates[1] + movementVector.y;

        gameObjectsCoordinates[gameObjectId] = [ x, y ];
      }
    });

    Object.keys(gameObjectsCoordinates).forEach((gameObjectId) => {
      const coordinates = gameObjectsCoordinates[gameObjectId];
      currentScene.placeGameObject(coordinates[0], coordinates[1], gameObjectId);
    });
  }
}

export default PhysicsProcessor;
