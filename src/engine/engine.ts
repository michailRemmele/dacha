import type { SystemsMap, HelperFn } from './system';
import type { ComponentsMap } from './component';
import type { Config } from './types';
import { SceneProvider } from './scene/scene-provider';
import { GameObjectCreator } from './game-object';
import { TemplateCollection } from './template';
import { GameLoop } from './game-loop';
import { SceneController } from './controllers';

export interface EngineOptions {
  config: Config
  systems: SystemsMap
  components: ComponentsMap
  helpers: Record<string, HelperFn>
}

export class Engine {
  private options: EngineOptions;

  constructor(options: EngineOptions) {
    this.options = options;
  }

  async start(): Promise<void> {
    const {
      config: {
        templates,
        scenes,
        levels,
        loaders,
        startSceneId,
        startLoaderId,
      },
      systems,
      components,
      helpers,
    } = this.options;

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
      sceneId: startSceneId,
      loaderId: startLoaderId,
    });

    if (asyncLoading && !startLoaderId) {
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
