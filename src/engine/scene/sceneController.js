class SceneController {
  constructor(sceneProvider) {
    this._sceneProvider = sceneProvider;
  }

  getCurrentName() {
    return this._sceneProvider.getCurrentScene().getName();
  }

  load(name) {
    this._sceneProvider.loadScene(name);
  }

  isLoaded() {
    return this._sceneProvider.isLoaded();
  }

  moveToLoaded() {
    this._sceneProvider.moveToLoaded();
  }

  moveTo(name) {
    this._sceneProvider.setCurrentScene(name);
  }
}

export default SceneController;
