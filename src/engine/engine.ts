import type { System, HelperFn } from './system';
import type { Component } from './component';
import type { Config } from './types';
import ScopeProvider from './scope/scopeProvider';
import IOC from './ioc/ioc';
import ResolveSingletonStrategy from './ioc/resolveSingletonStrategy';
import { SceneProvider } from './scene/scene-provider';
import ResourceLoader from './resourceLoader/resourceLoader';
import { EntityCreator } from './entity';
import { PrefabCollection } from './prefab';
import { GameLoop } from './game-loop';
import { SceneController } from './controllers';

import * as global from './consts/global';

export interface EngineOptions {
  config: Config
  systems: Record<string, { new(): System }>
  components: Record<string, { new(): Component }>
  helpers: Record<string, HelperFn>
}

export class Engine {
  private options: EngineOptions;

  constructor(options: EngineOptions) {
    const {
      GENERAL_SCOPE_NAME,
    } = global;

    this.options = options;

    ScopeProvider.createScope(GENERAL_SCOPE_NAME);
    ScopeProvider.setCurrentScope(GENERAL_SCOPE_NAME);
  }

  async start(): Promise<void> {
    const {
      RESOURCES_LOADER_KEY_NAME,
      PREFAB_COLLECTION_KEY_NAME,
    } = global;

    const {
      config: {
        prefabs,
        scenes,
        levels,
        loaders,
        startScene,
        startLoader,
      },
      systems,
      components,
      helpers,
    } = this.options;

    const resourceLoader = new ResourceLoader();
    IOC.register(RESOURCES_LOADER_KEY_NAME, new ResolveSingletonStrategy(resourceLoader));

    const prefabCollection = new PrefabCollection(components);
    IOC.register(PREFAB_COLLECTION_KEY_NAME, new ResolveSingletonStrategy(prefabCollection));

    for (let i = 0; i < prefabs.length; i += 1) {
      prefabCollection.register(prefabs[i]);
    }

    const entityCreator = new EntityCreator(components);

    const sceneProvider = new SceneProvider({
      scenes,
      levels,
      loaders,
      systems,
      helpers,
      entityCreator,
    });

    await sceneProvider.prepareLoaders();

    const asyncLoading = sceneProvider.loadScene({
      name: startScene,
      loader: startLoader,
    });

    if (asyncLoading && !startLoader) {
      await asyncLoading;
      sceneProvider.moveToLoaded();
    }

    const gameLoop = new GameLoop(
      sceneProvider,
      [
        new SceneController({ sceneProvider }),
      ],
    );
    gameLoop.run();

    window.onblur = (): void => gameLoop.stop();
    window.onfocus = (): void => gameLoop.run();
  }
}
