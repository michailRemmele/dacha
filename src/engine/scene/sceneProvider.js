import IOC from '../ioc/ioc';
import Scene from './scene';
import GameObjectObserver from '../gameObject/gameObjectObserver';
import SceneController from './sceneController';

import { RESOURCES_LOADER_KEY_NAME } from '../consts/global';

class SceneProvider {
  constructor(scenes, processorsPlugins, pluginHelpers) {
    this._sceneContainer = {};
    this._currentSceneName = undefined;
    this._sceneChangeSubscribers = [];
    this._availableScenes = scenes;
    this._processorsPlugins = Object.keys(processorsPlugins).reduce((storage, name) => {
      const ProcessorPlugin = processorsPlugins[name];
      storage[name] = new ProcessorPlugin();
      return storage;
    }, {});
    this._pluginHelpers = pluginHelpers;
    this._loadedScene = null;
    this._sceneController = new SceneController(this);
  }

  async loadScene(name) {
    if (!this._availableScenes[name]) {
      throw new Error(`Error while loading the scene. Not found scene with same name: ${name}`);
    }

    this._loadedScene = undefined;

    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);

    const sceneConfig = await resourceLoader.load(this._availableScenes[name]);

    const scene = new Scene({
      name: sceneConfig.name,
      gameObjects: sceneConfig.gameObjects,
    });

    for (let i = 0; i < sceneConfig.processors.length; i += 1) {
      const {
        name: processorName, filter, options, section,
      } = sceneConfig.processors[i];

      const gameObjectObserver = new GameObjectObserver(scene, filter);

      // For pure async await syntax in method. Need to refactor later
      // eslint-disable-next-line no-await-in-loop
      const processor = await this._processorsPlugins[processorName].load({
        ...options,
        store: scene.getStore(),
        gameObjectSpawner: scene.getGameObjectSpawner(),
        gameObjectDestroyer: scene.getGameObjectDestroyer(),
        gameObjectObserver,
        sceneController: this._sceneController,
        helpers: this._pluginHelpers,
      });

      scene.addProcessor(processor, section);
    }

    this._loadedScene = scene;
  }

  isLoaded() {
    return !!this._loadedScene;
  }

  moveToLoaded() {
    if (!this._loadedScene) {
      return;
    }

    if (this._sceneContainer[this._currentSceneName]) {
      this.leaveCurrentScene();
    }

    const name = this._loadedScene.getName();
    this._sceneContainer[name] = this._loadedScene;
    this._loadedScene = undefined;
    this.setCurrentScene(name);
  }

  leaveCurrentScene() {
    if (!this._sceneContainer[this._currentSceneName]) {
      throw new Error('Error while leaving current scene. Current scene is null');
    }

    this._sceneContainer[this._currentSceneName].unmount();
    this._currentSceneName = undefined;
  }

  removeScene(name) {
    if (name === this._currentSceneName) {
      this.leaveCurrentScene();
    }

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
