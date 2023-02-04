import type { SystemsMap, HelperFn } from './system';
import type { ComponentsMap } from './component';
import type { Config } from './types';
import ScopeProvider from './scope/scopeProvider';
import IOC from './ioc/ioc';
import ResolveSingletonStrategy from './ioc/resolveSingletonStrategy';
import { SceneProvider } from './scene/scene-provider';
import { ResourceLoader } from './resource-loader';
import { GameObjectCreator } from './game-object';
import { TemplateCollection } from './template';
import { GameLoop } from './game-loop';
import { SceneController } from './controllers';

import * as global from './consts/global';

export interface EngineOptions {
  config: Config
  systems: SystemsMap
  components: ComponentsMap
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
    } = global;

    const {
      config: {
        templates,
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

    const templateCollection = new TemplateCollection(components);

    for (let i = 0; i < templates.length; i += 1) {
      templateCollection.register(templates[i]);
    }

    const gameObjectCreator = new GameObjectCreator(components, templateCollection);

    const sceneProvider = new SceneProvider({
      scenes,
      levels,
      loaders,
      systems,
      helpers,
      gameObjectCreator,
      templateCollection,
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
