import type {
  SceneProvider, Scene,
} from '../scene';
import { LoadLevel, LoadScene } from '../events';
import type { LoadLevelEvent, LoadSceneEvent } from '../events';

import type { Controller, ControllerOptions } from './controller';

export class SceneController implements Controller {
  private sceneProvider: SceneProvider;
  private currentScene?: Scene;

  private nextSceneEvent?: LoadSceneEvent;
  private nextLevelEvent?: LoadLevelEvent;

  constructor({ sceneProvider }: ControllerOptions) {
    this.sceneProvider = sceneProvider;
  }

  private handleLoadScene = (event: LoadSceneEvent): void => {
    this.nextSceneEvent = event;
  };

  private handleLoadLevel = (event: LoadLevelEvent): void => {
    this.nextLevelEvent = event;
  };

  update(): void {
    const currentScene = this.sceneProvider.getCurrentScene();

    if (this.currentScene !== currentScene) {
      this.currentScene?.removeEventListener(LoadScene, this.handleLoadScene);
      this.currentScene?.removeEventListener(LoadLevel, this.handleLoadLevel);

      if (currentScene !== undefined) {
        currentScene?.addEventListener(LoadScene, this.handleLoadScene);
        currentScene?.addEventListener(LoadLevel, this.handleLoadLevel);
      }

      this.currentScene = currentScene;
    }

    if (this.nextSceneEvent !== undefined) {
      const {
        sceneId,
        loaderId,
        levelId,
        clean,
        unloadCurrent,
      } = this.nextSceneEvent;

      void this.sceneProvider.loadScene({
        sceneId,
        loaderId,
        levelId,
        clean,
        unloadCurrent,
      });
      this.nextSceneEvent = undefined;
    }

    if (this.nextLevelEvent !== undefined) {
      const {
        levelId,
        loaderId,
      } = this.nextLevelEvent;

      void this.sceneProvider.loadLevel({
        levelId,
        loaderId,
      });
      this.nextLevelEvent = undefined;
    }

    if (this.sceneProvider.isLoaded()) {
      this.sceneProvider.moveToLoaded();
    }
  }
}
