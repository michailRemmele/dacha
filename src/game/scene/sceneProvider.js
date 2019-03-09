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
    const {
      ACTION_RESOLVER_KEY_NAME,
      KEY_RESOLVER_KEY_NAME,
      GAME_OBJECT_CREATOR_KEY_NAME,
    } = global;

    const gameObjectCreator = IOC.resolve(GAME_OBJECT_CREATOR_KEY_NAME);
    const actionResolver = IOC.resolve(ACTION_RESOLVER_KEY_NAME);
    const keyResolver = IOC.resolve(KEY_RESOLVER_KEY_NAME);

    const scene = new Scene({
      name: config.name,
      width: config.map.width,
      height: config.map.height,
    });

    config.gameObjects.forEach((gameObject) => {
      scene.addGameObject(gameObjectCreator.create(gameObject.name, gameObject.id));
    });

    config.map.content.forEach((gameObject) => {
      scene.placeGameObject(gameObject.coordinates[0], gameObject.coordinates[1], gameObject.id);
    });

    config.actionList.forEach((actionInfo) => {
      actionResolver.register(actionInfo.name);
      keyResolver.register(config.name, actionInfo);
    });

    this.sceneContainer[config.name] = scene;
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
