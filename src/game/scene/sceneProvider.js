import * as global from 'consts/global';

import IOC from 'core/ioc/ioc';

import Scene from './scene';

class SceneProvider {
  constructor() {
    this.sceneContainer = {};
    this.currentSceneName = undefined;
    this.sceneChangeSubscribers = [];
  }

  createScene(config) {
    this.sceneContainer[config.name] = new Scene(config);

    const actionResolver = IOC.resolve(global.ACTION_RESOLVER_KEY_NAME);
    const keyResolver = IOC.resolve(global.KEY_RESOLVER_KEY_NAME);
    config.actionList.forEach((actionInfo) => {
      actionResolver.register(actionInfo.name);
      keyResolver.register(config.name, actionInfo);
    });
  }

  removeScene(name) {
    this.sceneContainer[name] = undefined;
  }

  setCurrentScene(name) {
    if (!this.sceneContainer[name]) {
      throw new Error(`Error while setting new scene. Not found scene with same name: ${name}`);
    }

    this.currentSceneName = name;

    this.sceneChangeSubscribers.forEach((callback) => {
      callback(this.sceneContainer[this.currentSceneName]);
    });
  }

  getCurrentScene() {
    if (!this.currentSceneName) {
      throw new Error('Current scene is null');
    }

    return this.sceneContainer[this.currentSceneName];
  }

  subscribeOnSceneChange(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this.sceneChangeSubscribers.push(callback);
  }
}

export default SceneProvider;
