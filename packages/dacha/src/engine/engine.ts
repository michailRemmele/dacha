import type { SystemConstructor } from './system';
import type { ComponentConstructor } from './component';
import type { Config } from './types';
import { SceneManager } from './scene/scene-manager';
import { TemplateCollection } from './template';
import { Assets } from './asset';
import type { AssetConstructor } from './asset';
import { GameLoop } from './game-loop';
import type { PerformanceSettings } from './game-loop';
import { Time } from './time';

export interface EngineOptions {
  config: Config;
  systems: SystemConstructor[];
  components: ComponentConstructor[];
  assets: AssetConstructor[];
  resources?: Record<string, unknown>;
}

/**
 * Main game engine responsible for bootstrapping scenes and systems, managing the
 * game loop, and controlling lifecycle actions (play, pause, stop).
 *
 * @category Core
 */
export class Engine {
  private options: EngineOptions;
  private gameLoop?: GameLoop;
  private sceneManager?: SceneManager;

  /**
   * Creates a new engine instance.
   *
   * @param options - Configuration, available systems, components, and asset kinds, and optional shared resources.
   * @param options.config - Configuration for the engine. It contains game world description such as scenes, actors, and their components.
   * @param options.systems - Available systems for the engine.
   * @param options.components - Available components for the engine.
   * @param options.assets - Available asset kinds for the engine.
   * @param options.resources - Optional shared resources used by the engine's systems.
   */
  constructor(options: EngineOptions) {
    this.options = options;
  }

  /**
   * Starts the engine. If the engine was already initialized, this resumes the
   * game loop and re-attaches window listeners. Otherwise, it bootstraps the
   * world, loads the start scene, creates the game loop, and begins execution.
   *
   * @returns A promise that resolves once the engine is fully started.
   * @throws Error If `startSceneId` is not provided in the config.
   * @throws Error If any component is missing `componentName`.
   * @throws Error If any system is missing `systemName`.
   * @throws Error If any asset class is missing `assetName`.
   */
  async play(): Promise<void> {
    if (this.sceneManager !== undefined && this.gameLoop !== undefined) {
      this.gameLoop.run();
      return;
    }

    const {
      config: {
        templates,
        scenes,
        systems,
        assets: assetConfigs,
        startSceneId,
        globalOptions: rawGlobalOptions,
      },
      systems: availableSystems,
      components,
      assets: availableAssets,
      resources = {},
    } = this.options;

    if (!startSceneId) {
      throw new Error(
        "Can't start the engine without starting scene. Please specify start scene id.",
      );
    }

    for (const component of components) {
      if (component.componentName === undefined) {
        throw new Error(
          `Missing componentName field for ${component.name} component.`,
        );
      }
    }

    for (const availableSystem of availableSystems) {
      if (availableSystem.systemName === undefined) {
        throw new Error(
          `Missing systemName field for ${availableSystem.name} system.`,
        );
      }
    }

    for (const availableAsset of availableAssets) {
      if (availableAsset.assetName === undefined) {
        throw new Error(
          `Missing assetName field for ${availableAsset.name} asset.`,
        );
      }
    }

    const templateCollection = new TemplateCollection();

    for (const template of templates) {
      templateCollection.register(template);
    }

    const assets = new Assets(availableAssets);

    for (const config of assetConfigs) {
      assets.register(config);
    }

    const globalOptions = rawGlobalOptions.reduce(
      (acc: Record<string, unknown>, option) => {
        acc[option.name] = option.options;
        return acc;
      },
      {},
    );

    const time = new Time();

    this.sceneManager = new SceneManager({
      sceneConfigs: scenes,
      systemConfigs: systems,
      availableSystems,
      components,
      templateCollection,
      assets,
      globalOptions,
      resources,
      time,
    });

    await this.sceneManager.loadWorld();
    await this.sceneManager.loadScene(startSceneId, true);

    this.gameLoop = new GameLoop(
      this.sceneManager,
      time,
      globalOptions.performance as PerformanceSettings | undefined,
    );

    this.gameLoop.run();
  }

  /**
   * Pauses the engine by stopping the game loop.
   * The world and scene state remain in memory so it can be resumed with `play`.
   */
  pause(): void {
    this.gameLoop?.stop();
  }

  /**
   * Stops the engine completely by stopping the game loop and destroying the world.
   */
  stop(): void {
    this.gameLoop?.stop();
    this.sceneManager?.destroyWorld();

    this.gameLoop = undefined;
    this.sceneManager = undefined;
  }
}
