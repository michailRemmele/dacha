import type { SceneProvider } from './scene-provider';

export class SceneController {
  private _sceneProvider: SceneProvider;

  constructor(sceneProvider: SceneProvider) {
    this._sceneProvider = sceneProvider;
  }

  getCurrentName() {
    return this._sceneProvider.getCurrentScene().getName();
  }

  load(name: string) {
    return this._sceneProvider.loadScene(name);
  }

  isLoaded() {
    return this._sceneProvider.isLoaded();
  }

  moveToLoaded() {
    this._sceneProvider.moveToLoaded();
  }

  moveTo(name: string) {
    this._sceneProvider.setCurrentScene(name);
  }
}
