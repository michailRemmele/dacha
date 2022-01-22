const LOAD_SCENE_MSG = 'LOAD_SCENE';

class SceneLoadProcessor {
  constructor(options) {
    this._sceneController = options.sceneController;
    this.messageBus = options.messageBus;
    this._sceneLoading = false;
  }

  _loadScene() {
    const messages = this.messageBus.get(LOAD_SCENE_MSG);
    if (messages) {
      const { name } = messages[messages.length - 1];

      this._sceneController.load(name);
      this._sceneLoading = true;
    }
  }

  _moveToLoaded() {
    this.messageBus.reset();
    this._sceneController.moveToLoaded();
    this._sceneLoading = false;
  }

  process() {
    if (!this._sceneLoading) {
      this._loadScene();
    } else if (this._sceneController.isLoaded()) {
      this._moveToLoaded();
    }
  }
}

export default SceneLoadProcessor;
