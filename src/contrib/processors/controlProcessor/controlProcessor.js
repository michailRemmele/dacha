import Processor from 'engine/processor/processor';
import IOC from 'engine/ioc/ioc';

import * as global from 'engine/consts/global';

const CONTROLLABLE_COMPONENT_NAME = 'controllable';

class ControlProcessor extends Processor {
  getComponentList() {
    return [
      CONTROLLABLE_COMPONENT_NAME,
    ];
  }

  _validateGameObject(gameObject) {
    return this.getComponentList().every((component) => {
      return !!gameObject.getComponent(component);
    });
  }

  process(options) {
    const messageBus = options.messageBus;

    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    const currentScene = sceneProvider.getCurrentScene();

    currentScene.forEachPlacedGameObject((gameObject, x, y) => {
      if (!this._validateGameObject(gameObject))  {
        return;
      }

      const controllable = gameObject.getComponent(CONTROLLABLE_COMPONENT_NAME);

      Object.keys(controllable.actions).forEach((actionName) => {
        if (messageBus.get(controllable.actions[actionName])) {
          messageBus.send({
            type: actionName,
            gameObject: gameObject,
          });
        }
      });
    });
  }
}

export default ControlProcessor;
