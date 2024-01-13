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

  private handleLoadSceneMessage = (event: LoadSceneEvent): void => {
    this.nextSceneEvent = event;
  };

  private handleLoadLevelMessage = (event: LoadLevelEvent): void => {
    this.nextLevelEvent = event;
  };

  update(): void {
    const currentScene = this.sceneProvider.getCurrentScene();

    if (this.currentScene !== currentScene) {
      this.currentScene?.removeEventListener(LoadScene, this.handleLoadSceneMessage);
      this.currentScene?.removeEventListener(LoadLevel, this.handleLoadLevelMessage);

      if (currentScene !== undefined) {
        currentScene?.addEventListener(LoadScene, this.handleLoadSceneMessage);
        currentScene?.addEventListener(LoadLevel, this.handleLoadLevelMessage);
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
