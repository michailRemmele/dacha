import type { SystemConstructor } from './system';
import type { ComponentConstructor } from './component';
import type { Config } from './types';
import { SceneProvider } from './scene/scene-provider';
import { ActorCreator } from './actor';
import { TemplateCollection } from './template';
import { GameLoop } from './game-loop';
import type { PerformanceSettings } from './game-loop';
import { SceneController } from './controllers';

export interface EngineOptions {
  config: Config
  systems: Array<SystemConstructor>
  components: Array<ComponentConstructor>
  resources?: Record<string, unknown>
}

export class Engine {
  private options: EngineOptions;
  private gameLoop?: GameLoop;
  private sceneProvider?: SceneProvider;

  constructor(options: EngineOptions) {
    this.options = options;
  }

  private handleWindowBlur = (): void => {
    this.gameLoop?.stop();
  };

  private handleWindowFocus = (): void => {
    this.gameLoop?.run();
  };

  private addWindowListeners(): void {
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);
  }

  private removeWindowListeners(): void {
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  async play(): Promise<void> {
    if (this.sceneProvider !== undefined && this.gameLoop !== undefined) {
      this.gameLoop.run();
      this.addWindowListeners();
      return;
    }

    const {
      config: {
        templates,
        scenes,
        levels,
        loaders,
        startSceneId,
        startLoaderId,
        globalOptions: rawGlobalOptions,
      },
      systems,
      components,
      resources = {},
    } = this.options;

    if (!startSceneId) {
      throw new Error('Can\'t start the engine without starting scene. Please specify start scene id.');
    }

    for (let i = 0; i < components.length; i += 1) {
      if (components[i].componentName === undefined) {
        throw new Error(`Missing componentName field for ${components[i].name} component.`);
      }
    }

    for (let i = 0; i < systems.length; i += 1) {
      if (systems[i].systemName === undefined) {
        throw new Error(`Missing systemName field for ${systems[i].name} system.`);
      }
    }

    const templateCollection = new TemplateCollection(components);

    for (let i = 0; i < templates.length; i += 1) {
      templateCollection.register(templates[i]);
    }

    const actorCreator = new ActorCreator(components, templateCollection);

    const globalOptions = rawGlobalOptions.reduce((acc: Record<string, unknown>, option) => {
      acc[option.name] = option.options;
      return acc;
    }, {});

    this.sceneProvider = new SceneProvider({
      scenes,
      levels,
      loaders,
      systems,
      resources,
      globalOptions,
      actorCreator,
      templateCollection,
    });

    await this.sceneProvider.prepareLoaders();

    const asyncLoading = this.sceneProvider.loadScene({
      sceneId: startSceneId,
      loaderId: startLoaderId,
      levelId: null,
    });

    if (asyncLoading && !startLoaderId) {
      await asyncLoading;
      this.sceneProvider.moveToLoaded();
    }

    this.gameLoop = new GameLoop(
      this.sceneProvider,
      [
        new SceneController({ sceneProvider: this.sceneProvider }),
      ],
      globalOptions.performance as PerformanceSettings | undefined,
    );

    this.gameLoop.run();
    this.addWindowListeners();
  }

  pause(): void {
    this.gameLoop?.stop();
    this.removeWindowListeners();
  }

  stop(): void {
    this.gameLoop?.stop();
    this.sceneProvider?.leaveCurrentScene();
    this.removeWindowListeners();

    this.gameLoop = undefined;
    this.sceneProvider = undefined;
  }
}
