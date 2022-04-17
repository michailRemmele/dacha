import type { SystemPlugin, PluginHelperFn } from './system';
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

import * as global from './consts/global';

export interface EngineOptions {
  config: Config
  systemsPlugins: Record<string, { new(): SystemPlugin }>
  components: Record<string, { new(): Component }>
  pluginHelpers: Record<string, PluginHelperFn>
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
      ENTITY_CREATOR_KEY_NAME,
    } = global;

    const {
      config, systemsPlugins, components, pluginHelpers,
    } = this.options;

    const resourceLoader = new ResourceLoader();
    IOC.register(RESOURCES_LOADER_KEY_NAME, new ResolveSingletonStrategy(resourceLoader));

    const prefabCollection = new PrefabCollection(components);
    IOC.register(PREFAB_COLLECTION_KEY_NAME, new ResolveSingletonStrategy(prefabCollection));

    const entityCreator = new EntityCreator(components);
    IOC.register(ENTITY_CREATOR_KEY_NAME, new ResolveSingletonStrategy(entityCreator));

    const sceneProvider = new SceneProvider(config.scenes, systemsPlugins, pluginHelpers);

    for (let i = 0; i < config.prefabs.length; i += 1) {
      prefabCollection.register(config.prefabs[i]);
    }

    await sceneProvider.loadScene(config.startScene);
    sceneProvider.moveToLoaded();

    const gameLoop = new GameLoop(sceneProvider);
    gameLoop.run();

    window.onblur = (): void => gameLoop.stop();
    window.onfocus = (): void => gameLoop.run();
  }
}
