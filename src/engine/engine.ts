import type { SystemConstructor } from './system';
import type { ComponentConstructor } from './component';
import type { Config } from './types';
import { SceneManager } from './scene/scene-manager';
import { TemplateCollection } from './template';
import { GameLoop } from './game-loop';
import type { PerformanceSettings } from './game-loop';

export interface EngineOptions {
  config: Config
  systems: Array<SystemConstructor>
  components: Array<ComponentConstructor>
  resources?: Record<string, unknown>
}

export class Engine {
  private options: EngineOptions;
  private gameLoop?: GameLoop;
  private sceneManager?: SceneManager;

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
    if (this.sceneManager !== undefined && this.gameLoop !== undefined) {
      this.gameLoop.run();
      this.addWindowListeners();
      return;
    }

    const {
      config: {
        templates,
        scenes,
        systems,
        startSceneId,
        globalOptions: rawGlobalOptions,
      },
      systems: availableSystems,
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

    for (let i = 0; i < availableSystems.length; i += 1) {
      if (availableSystems[i].systemName === undefined) {
        throw new Error(`Missing systemName field for ${availableSystems[i].name} system.`);
      }
    }

    const templateCollection = new TemplateCollection(components);

    for (let i = 0; i < templates.length; i += 1) {
      templateCollection.register(templates[i]);
    }

    const globalOptions = rawGlobalOptions.reduce((acc: Record<string, unknown>, option) => {
      acc[option.name] = option.options;
      return acc;
    }, {});

    this.sceneManager = new SceneManager({
      sceneConfigs: scenes,
      systemConfigs: systems,
      availableSystems,
      components,
      templateCollection,
      globalOptions,
      resources,
    });

    await this.sceneManager.loadWorld();
    await this.sceneManager.loadScene(startSceneId, true);

    this.gameLoop = new GameLoop(
      this.sceneManager,
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
    this.sceneManager?.destroyWorld();
    this.removeWindowListeners();

    this.gameLoop = undefined;
    this.sceneManager = undefined;
  }
}
