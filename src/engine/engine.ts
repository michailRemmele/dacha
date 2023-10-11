import type { Constructor } from '../types/utils';

import type { System, HelperFn } from './system';
import type { Component } from './component';
import type { Config } from './types';
import { SceneProvider } from './scene/scene-provider';
import { GameObjectCreator } from './game-object';
import { TemplateCollection } from './template';
import { GameLoop } from './game-loop';
import { SceneController } from './controllers';

export interface EngineOptions {
  config: Config
  systems: Array<Constructor<System>>
  components: Array<Constructor<Component>>
  helpers: Record<string, HelperFn>
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
        globalOptions,
      },
      systems,
      components,
      helpers,
    } = this.options;

    if (!startSceneId) {
      throw new Error('Can\'t start the engine without starting scene. Please specify start scene id.');
    }

    const templateCollection = new TemplateCollection(components);

    for (let i = 0; i < templates.length; i += 1) {
      templateCollection.register(templates[i]);
    }

    const gameObjectCreator = new GameObjectCreator(components, templateCollection);

    this.sceneProvider = new SceneProvider({
      scenes,
      levels,
      loaders,
      systems,
      helpers,
      globalOptions,
      gameObjectCreator,
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
