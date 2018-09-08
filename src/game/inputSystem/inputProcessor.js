import * as global from 'consts/global';

import IOC from 'core/ioc/ioc';

import InputListener from './inputListener';

class InputProcessor {
  constructor() {
    this.inputListener = new InputListener(window);
  }

  run() {
    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    const currentScene = sceneProvider.getCurrentScene();
    const keyResolver = IOC.resolve(global.KEY_RESOLVER_KEY_NAME);

    this.inputListener.startListen(keyResolver.getKeys(currentScene.getName()));

    sceneProvider.subscribeOnSceneChange((nextScene) => {
      this.inputListener.reloadListen(keyResolver.getKeys(nextScene.getName()));
    });
  }

  stop() {
    this.inputListener.stopListen();
  }

  process() {
    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    const currentScene = sceneProvider.getCurrentScene();
    const currentSceneName = currentScene.getName();
    const keyResolver = IOC.resolve(global.KEY_RESOLVER_KEY_NAME);

    this.inputListener.getQueue().forEach((key) => {
      keyResolver.resolve(currentSceneName, key);
    });
    this.inputListener.clearQueue();
  }
}

export default InputProcessor;
