import Processor from 'engine/processor/processor';
import IOC from 'engine/ioc/ioc';

import * as global from 'engine/consts/global';
const MOVEMENT_MESSAGE_TYPE = 'MOVEMENT';

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

    currentScene.forEachPlacedGameObject((gameObject) => {
      if (!this._validateGameObject(gameObject))  {
        return;
      }

      const controllable = gameObject.getComponent(CONTROLLABLE_COMPONENT_NAME);

      const actions = Object.keys(controllable.actions).reduce((storage, inputEvent) => {
        if (messageBus.get(inputEvent)) {
          storage.push(controllable.actions[inputEvent]);
        }
        return storage;
      }, []);

      if (actions.length) {
        messageBus.send({
          type: MOVEMENT_MESSAGE_TYPE,
          gameObject: gameObject,
          actions: actions,
        });
      }
    });
  }
}

export default ControlProcessor;
