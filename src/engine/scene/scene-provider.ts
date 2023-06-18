import type { SceneConfig, LevelConfig, GlobalOption } from '../types';
import type { GameObjectCreator } from '../game-object';
import type { SystemsMap, HelperFn } from '../system';
import type { TemplateCollection } from '../template';

import { Scene } from './scene';
import { filterByKey } from '../utils';

interface SceneProviderOptions {
  scenes: Array<SceneConfig>
  loaders: Array<SceneConfig>
  levels: Array<LevelConfig>
  systems: SystemsMap
  helpers: Record<string, HelperFn>
  globalOptions: Array<GlobalOption>
  gameObjectCreator: GameObjectCreator
  templateCollection: TemplateCollection
}

export interface SceneLoadOptions {
  sceneId: string
  loaderId?: string
  levelId?: string
  clean?: boolean
  unloadCurrent?: boolean
}

export interface LevelLoadOptions {
  levelId: string
  loaderId?: string
}

export class SceneProvider {
  private availableScenes: Record<string, SceneConfig>;
  private availableLoaders: Record<string, SceneConfig>;
  private availableLevels: Record<string, LevelConfig>;
  private systems: SystemsMap;
  private helpers: Record<string, HelperFn>;
  private globalOptions: Record<string, unknown>;
  private sceneContainer: Record<string, Scene>;
  private currentSceneId?: string;
  private loadedScene?: Scene;
  private gameObjectCreator: GameObjectCreator;
  private templateCollection: TemplateCollection;

  constructor({
    scenes,
    levels,
    systems,
    loaders,
    helpers,
    globalOptions,
    gameObjectCreator,
    templateCollection,
  }: SceneProviderOptions) {
    this.sceneContainer = {};
    this.currentSceneId = void '';
    this.availableScenes = scenes.reduce((acc: Record<string, SceneConfig>, scene) => {
      acc[scene.id] = scene;
      return acc;
    }, {});
    this.availableLoaders = loaders.reduce((acc: Record<string, SceneConfig>, scene) => {
      acc[scene.id] = scene;
      return acc;
    }, {});
    this.availableLevels = levels.reduce((acc: Record<string, LevelConfig>, level) => {
      acc[level.id] = level;
      return acc;
    }, {});
    this.systems = systems;
    this.helpers = helpers;
    this.globalOptions = globalOptions.reduce((acc: Record<string, unknown>, option) => {
      acc[option.name] = option.value;
      return acc;
    }, {});
    this.loadedScene = void 0;
    this.gameObjectCreator = gameObjectCreator;
    this.templateCollection = templateCollection;
  }

  prepareLoaders(): Promise<Array<Array<void>>> {
    this.sceneContainer = Object.keys(this.availableLoaders)
      .reduce((acc: Record<string, Scene>, id) => {
        const loaderConfig = this.availableLoaders[id];
        acc[id] = new Scene({
          ...loaderConfig,
          gameObjects: loaderConfig.levelId
            ? this.availableLevels[loaderConfig.levelId].gameObjects
            : [],
          availableSystems: this.systems,
          helpers: this.helpers,
          globalOptions: this.globalOptions,
          gameObjectCreator: this.gameObjectCreator,
          templateCollection: this.templateCollection,
        });
        return acc;
      }, this.sceneContainer);

    return Promise.all(
      Object.keys(this.availableLoaders)
        .reduce((acc: Array<Promise<Array<void>>>, id) => {
          const asyncLoading = this.sceneContainer[id].load();
          if (asyncLoading) {
            acc.push(asyncLoading);
          }
          return acc;
        }, []),
    );
  }

  getCurrentScene(): Scene | undefined {
    if (!this.currentSceneId) {
      return void 0;
    }

    return this.sceneContainer[this.currentSceneId];
  }

  loadScene({
    sceneId,
    loaderId,
    levelId,
    clean = false,
    unloadCurrent = false,
  }: SceneLoadOptions): Promise<void> | undefined {
    if (!this.availableScenes[sceneId]) {
      throw new Error(`Error while loading the scene. Not found scene with same id: ${sceneId}`);
    }

    const { currentSceneId } = this;

    this.leaveCurrentScene();

    if (unloadCurrent && currentSceneId) {
      this.removeScene(currentSceneId);
    }

    let scene: Scene;

    if (clean || !this.sceneContainer[sceneId]) {
      const selectedLevelId = levelId || this.availableScenes[sceneId].levelId;

      scene = new Scene({
        ...this.availableScenes[sceneId],
        gameObjects: selectedLevelId ? this.availableLevels[selectedLevelId].gameObjects : [],
        availableSystems: this.systems,
        helpers: this.helpers,
        globalOptions: this.globalOptions,
        gameObjectCreator: this.gameObjectCreator,
        templateCollection: this.templateCollection,
      });

      const asyncLoading = scene.load();

      if (asyncLoading && loaderId) {
        this.setCurrentScene(loaderId);
      }

      if (asyncLoading) {
        return asyncLoading.then(() => {
          this.loadedScene = scene;
        });
      }
    } else {
      scene = this.sceneContainer[sceneId];
    }

    this.setCurrentScene(scene.id);

    return void 0;
  }

  loadLevel({ levelId, loaderId }: LevelLoadOptions): Promise<void> | undefined {
    if (!this.currentSceneId) {
      throw new Error('Can\'t load the level. Current scene is null');
    }

    return this.loadScene({
      sceneId: this.currentSceneId,
      levelId,
      loaderId,
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

    const { id } = this.loadedScene;
    this.sceneContainer[id] = this.loadedScene;
    this.loadedScene = void 0;
    this.setCurrentScene(id);
  }

  private setCurrentScene(id: string): void {
    if (!this.sceneContainer[id]) {
      throw new Error(`Error while setting new scene. Not found scene with same id: ${id}`);
    }

    this.currentSceneId = id;
    this.sceneContainer[this.currentSceneId].mount();
  }

  private leaveCurrentScene(): void {
    if (!this.currentSceneId || !this.sceneContainer[this.currentSceneId]) {
      return;
    }

    this.sceneContainer[this.currentSceneId].unmount();
    this.currentSceneId = void '';
  }

  private removeScene(id: string): void {
    this.sceneContainer = filterByKey(this.sceneContainer, id);
  }
}
