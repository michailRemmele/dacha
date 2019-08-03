import * as global from 'engine/consts/global';

import IOC from 'engine/ioc/ioc';
import Scene from './scene';
import GameObjectObserver from 'engine/gameObject/gameObjectObserver';

class SceneProvider {
  constructor(processorsPlugins) {
    this._sceneContainer = {};
    this._currentSceneName = undefined;
    this._sceneChangeSubscribers = [];
    this._processorsPlugins = Object.keys(processorsPlugins).reduce((storage, name) => {
      const ProcessorPlugin = processorsPlugins[name];
      storage[name] = new ProcessorPlugin();
      return storage;
    }, {});
  }

  async createScene(config) {
    const { GAME_OBJECT_CREATOR_KEY_NAME } = global;

    const gameObjectCreator = IOC.resolve(GAME_OBJECT_CREATOR_KEY_NAME);

    const scene = new Scene({
      name: config.name,
    });

    config.gameObjects.forEach((gameObjectOptions) => {
      gameObjectCreator.create(gameObjectOptions).forEach((gameObject) => {
        scene.addGameObject(gameObject);
      });
    });

    await Promise.all(config.processors.map((processorInfo) => {
      const gameObjectObserver = new GameObjectObserver(scene, processorInfo.components);

      return this._processorsPlugins[processorInfo.name].load({
        ...processorInfo.options,
        store: scene.getStore(),
        gameObjectObserver: gameObjectObserver,
      })
        .then((processor) => {
          scene.addProcessor(processor, processorInfo.section);
        });
    }));

    this._sceneContainer[config.name] = scene;
  }

  removeScene(name) {
    this._sceneContainer[name] = undefined;
  }

  setCurrentScene(name) {
    if (!this._sceneContainer[name]) {
      throw new Error(`Error while setting new scene. Not found scene with same name: ${name}`);
    }

    if (this._sceneContainer[this._currentSceneName]) {
      this._sceneContainer[this._currentSceneName].unmount();
    }

    this._currentSceneName = name;

    this._sceneContainer[this._currentSceneName].mount();

    this._sceneChangeSubscribers.forEach((callback) => {
      callback(this._sceneContainer[this._currentSceneName]);
    });
  }

  getCurrentScene() {
    if (!this._currentSceneName) {
      throw new Error('Current scene is null');
    }

    return this._sceneContainer[this._currentSceneName];
  }

  subscribeOnSceneChange(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._sceneChangeSubscribers.push(callback);
  }
}

export default SceneProvider;
