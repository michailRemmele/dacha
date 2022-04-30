import type { SceneConfig, LevelConfig } from '../types';
import type { GameObjectCreator } from '../game-object';
import type { System, HelperFn } from '../system';

import { Scene } from './scene';
import { filterByKey } from '../utils';

interface SceneProviderOptions {
  scenes: Array<SceneConfig>
  loaders: Array<SceneConfig>
  levels: Array<LevelConfig>
  systems: Record<string, { new(): System }>
  helpers: Record<string, HelperFn>
  gameObjectCreator: GameObjectCreator
}

export interface SceneLoadOptions {
  name: string
  loader?: string
  level?: string
  clean?: boolean
  unloadCurrent?: boolean
}

export interface LevelLoadOptions {
  name: string
  loader?: string
}

export class SceneProvider {
  private availableScenes: Record<string, SceneConfig>;
  private availableLoaders: Record<string, SceneConfig>;
  private availableLevels: Record<string, LevelConfig>;
  private systems: Record<string, { new(): System }>;
  private helpers: Record<string, HelperFn>;
  private sceneContainer: Record<string, Scene>;
  private currentSceneName?: string;
  private loadedScene?: Scene;
  private gameObjectCreator: GameObjectCreator;

  constructor({
    scenes,
    levels,
    systems,
    loaders,
    helpers,
    gameObjectCreator,
  }: SceneProviderOptions) {
    this.sceneContainer = {};
    this.currentSceneName = void '';
    this.availableScenes = scenes.reduce((acc: Record<string, SceneConfig>, scene) => {
      acc[scene.name] = scene;
      return acc;
    }, {});
    this.availableLoaders = loaders.reduce((acc: Record<string, SceneConfig>, scene) => {
      acc[scene.name] = scene;
      return acc;
    }, {});
    this.availableLevels = levels.reduce((acc: Record<string, LevelConfig>, level) => {
      acc[level.name] = level;
      return acc;
    }, {});
    this.systems = systems;
    this.helpers = helpers;
    this.loadedScene = void 0;
    this.gameObjectCreator = gameObjectCreator;
  }

  prepareLoaders(): Promise<Array<Array<void>>> {
    this.sceneContainer = Object.keys(this.availableLoaders)
      .reduce((acc: Record<string, Scene>, name) => {
        const loaderConfig = this.availableLoaders[name];
        acc[name] = new Scene({
          ...loaderConfig,
          gameObjects: loaderConfig.level
            ? this.availableLevels[loaderConfig.level].gameObjects
            : [],
          availableSystems: this.systems,
          helpers: this.helpers,
          gameObjectCreator: this.gameObjectCreator,
        });
        return acc;
      }, this.sceneContainer);

    return Promise.all(
      Object.keys(this.availableLoaders)
        .reduce((acc: Array<Promise<Array<void>>>, name) => {
          const asyncLoading = this.sceneContainer[name].load();
          if (asyncLoading) {
            acc.push(asyncLoading);
          }
          return acc;
        }, []),
    );
  }

  getCurrentScene(): Scene | undefined {
    if (!this.currentSceneName) {
      return void 0;
    }

    return this.sceneContainer[this.currentSceneName];
  }

  loadScene({
    name,
    loader,
    clean = false,
    unloadCurrent = false,
    level,
  }: SceneLoadOptions): Promise<void> | undefined {
    if (!this.availableScenes[name]) {
      throw new Error(`Error while loading the scene. Not found scene with same name: ${name}`);
    }

    const currentSceneName = this.currentSceneName;

    this.leaveCurrentScene();

    if (unloadCurrent && currentSceneName) {
      this.removeScene(currentSceneName);
    }

    let scene: Scene;

    if (clean || !this.sceneContainer[name]) {
      const levelName = level || this.availableScenes[name].level;

      scene = new Scene({
        ...this.availableScenes[name],
        gameObjects: levelName ? this.availableLevels[levelName].gameObjects : [],
        availableSystems: this.systems,
        helpers: this.helpers,
        gameObjectCreator: this.gameObjectCreator,
      });

      const asyncLoading = scene.load();

      if (asyncLoading && loader) {
        this.setCurrentScene(loader);
      }

      if (asyncLoading) {
        return asyncLoading.then(() => {
          this.loadedScene = scene;
        });
      }
    } else {
      scene = this.sceneContainer[name];
    }

    this.setCurrentScene(scene.getName());

    return void 0;
  }

  loadLevel({ name, loader }: LevelLoadOptions): Promise<void> | undefined {
    if (!this.currentSceneName) {
      throw new Error('Can\'t load the level. Current scene is null');
    }

    return this.loadScene({
      name: this.currentSceneName,
      level: name,
      loader,
      clean: true,
      unloadCurrent: true,
    });
  }

  isLoaded(): boolean {
    return Boolean(this.loadedScene);
  }

  moveToLoaded(): void {
    if (!this.loadedScene) {
      return;
    }

    this.leaveCurrentScene();

    const name = this.loadedScene.getName();
    this.sceneContainer[name] = this.loadedScene;
    this.loadedScene = void 0;
    this.setCurrentScene(name);
  }

  private setCurrentScene(name: string): void {
    if (!this.sceneContainer[name]) {
      throw new Error(`Error while setting new scene. Not found scene with same name: ${name}`);
    }

    this.currentSceneName = name;
    this.sceneContainer[this.currentSceneName].mount();
  }

  private leaveCurrentScene(): void {
    if (!this.currentSceneName || !this.sceneContainer[this.currentSceneName]) {
      return;
    }

    this.sceneContainer[this.currentSceneName].unmount();
    this.currentSceneName = void '';
  }

  private removeScene(name: string): void {
    this.sceneContainer = filterByKey(this.sceneContainer, name);
  }
}
