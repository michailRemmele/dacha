import type { SceneConfig } from '../types';
import { SystemPlugin, PluginHelperFn } from '../system';

import { Scene } from './scene';
import { SceneController } from './scene-controller';

export class SceneProvider {
  private _sceneContainer: Record<string, Scene>;
  private _currentSceneName?: string;
  private _sceneChangeSubscribers: Array<(scene: Scene) => void>;
  private _availableScenes: Record<string, SceneConfig>;
  private _systemsPlugins: Record<string, SystemPlugin>;
  private _pluginHelpers: Record<string, PluginHelperFn>;
  private _loadedScene?: Scene;
  private _sceneController: SceneController;

  constructor(
    scenes: Array<SceneConfig>,
    systemsPlugins: Record<string, { new(): SystemPlugin }>,
    pluginHelpers: Record<string, PluginHelperFn>,
  ) {
    this._sceneContainer = {};
    this._currentSceneName = void 0;
    this._sceneChangeSubscribers = [];
    this._availableScenes = scenes.reduce((acc: Record<string, SceneConfig>, scene) => {
      acc[scene.name] = scene;
      return acc;
    }, {});
    this._systemsPlugins = Object
      .keys(systemsPlugins)
      .reduce((storage: Record<string, SystemPlugin>, name) => {
        storage[name] = new systemsPlugins[name]();
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

    const sceneConfig = this._availableScenes[name];

    const scene = new Scene({
      name: sceneConfig.name,
      entities: sceneConfig.entities,
    });

    for (let i = 0; i < sceneConfig.systems.length; i += 1) {
      const { name: systemName, options } = sceneConfig.systems[i];

      // For pure async await syntax in method. Need to refactor later
      // eslint-disable-next-line no-await-in-loop
      const system = await this._systemsPlugins[systemName].load({
        ...options,
        store: scene.getStore(),
        entitySpawner: scene.getEntitySpawner(),
        entityDestroyer: scene.getEntityDestroyer(),
        createEntityObserver: (filter) => scene.createEntityObserver(filter),
        messageBus: scene.getMessageBus(),
        sceneController: this._sceneController,
        helpers: this._pluginHelpers,
      });

      scene.addSystem(system);
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

    if (this._currentSceneName && this._sceneContainer[this._currentSceneName]) {
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
