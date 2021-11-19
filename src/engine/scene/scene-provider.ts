import IOC from '../ioc/ioc';
import { ProcessorPlugin, PluginHelper } from '../processor';

import { Scene, SceneOptions } from './scene';
import { SceneController } from './scene-controller';

import { RESOURCES_LOADER_KEY_NAME } from '../consts/global';

// TODO: Remove once resource loader will be moved to ts
interface ResourceLoader {
  load: (resource: string) => unknown;
}

interface SceneConfig extends SceneOptions {
  processors: Array<{
    name: string;
    options: Record<string, unknown>;
  }>;
}

export class SceneProvider {
  private _sceneContainer: Record<string, Scene>;
  private _currentSceneName?: string;
  private _sceneChangeSubscribers: Array<(scene: Scene) => void>;
  private _availableScenes: Record<string, string>;
  private _processorsPlugins: Record<string, ProcessorPlugin>;
  private _pluginHelpers: Record<string, PluginHelper>;
  private _loadedScene?: Scene;
  private _sceneController: SceneController;

  constructor(
    scenes: Record<string, string>,
    processorsPlugins: Record<string, { new(): ProcessorPlugin }>,
    pluginHelpers: Record<string, PluginHelper>,
  ) {
    this._sceneContainer = {};
    this._currentSceneName = void 0;
    this._sceneChangeSubscribers = [];
    this._availableScenes = scenes;
    this._processorsPlugins = Object
      .keys(processorsPlugins)
      .reduce((storage: Record<string, ProcessorPlugin>, name) => {
        storage[name] = new processorsPlugins[name]();
        return storage;
      }, {});
    this._pluginHelpers = pluginHelpers;
    this._loadedScene = void 0;
    this._sceneController = new SceneController(this);
  }

  async loadScene(name: string) {
    if (!this._availableScenes[name]) {
      throw new Error(`Error while loading the scene. Not found scene with same name: ${name}`);
    }

    this._loadedScene = void 0;

    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME) as ResourceLoader;

    const sceneConfig = await resourceLoader.load(this._availableScenes[name]) as SceneConfig;

    const scene = new Scene({
      name: sceneConfig.name,
      gameObjects: sceneConfig.gameObjects,
    });

    for (let i = 0; i < sceneConfig.processors.length; i += 1) {
      const { name: processorName, options } = sceneConfig.processors[i];

      // For pure async await syntax in method. Need to refactor later
      // eslint-disable-next-line no-await-in-loop
      const processor = await this._processorsPlugins[processorName].load({
        ...options,
        store: scene.getStore(),
        gameObjectSpawner: scene.getGameObjectSpawner(),
        gameObjectDestroyer: scene.getGameObjectDestroyer(),
        createGameObjectObserver: (filter) => scene.createGameObjectObserver(filter),
        sceneController: this._sceneController,
        helpers: this._pluginHelpers,
      });

      scene.addProcessor(processor);
    }

    this._loadedScene = scene;
  }

  isLoaded() {
    return !!this._loadedScene;
  }

  moveToLoaded() {
    if (!this._loadedScene || !this._currentSceneName) {
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
    if (!this._currentSceneName) {
      throw new Error('Error while leaving current scene. Current scene is not specified');
    }

    if (!this._sceneContainer[this._currentSceneName]) {
      throw new Error('Error while leaving current scene. Current scene is null');
    }

    this._sceneContainer[this._currentSceneName].unmount();
    this._currentSceneName = undefined;
  }

  removeScene(name: string) {
    if (name === this._currentSceneName) {
      this.leaveCurrentScene();
    }

    this._sceneContainer = Object.keys(this._sceneContainer)
      .reduce((acc: Record<string, Scene>, key) => {
        if (key !== name) {
          acc[key] = this._sceneContainer[key];
        }

        return acc;
      }, {});
  }

  setCurrentScene(name: string) {
    if (!this._sceneContainer[name]) {
      throw new Error(`Error while setting new scene. Not found scene with same name: ${name}`);
    }

    if (this._currentSceneName && this._sceneContainer[this._currentSceneName]) {
      this._sceneContainer[this._currentSceneName].unmount();
    }

    this._currentSceneName = name;

    const currentScene = this._sceneContainer[this._currentSceneName];

    currentScene.mount();

    this._sceneChangeSubscribers.forEach((callback) => {
      callback(currentScene);
    });
  }

  getCurrentScene() {
    if (!this._currentSceneName) {
      throw new Error('Current scene is null');
    }

    return this._sceneContainer[this._currentSceneName];
  }

  subscribeOnSceneChange(callback: (scene: Scene) => void) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._sceneChangeSubscribers.push(callback);
  }
}
