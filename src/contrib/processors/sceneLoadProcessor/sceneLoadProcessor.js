const LOAD_SCENE_MSG = 'LOAD_SCENE';

class SceneLoadProcessor {
  constructor(options) {
    this._sceneController = options.sceneController;
    this._sceneLoading = false;
  }

  _loadScene(messageBus) {
    const messages = messageBus.get(LOAD_SCENE_MSG);
    if (messages) {
      const { name } = messages[messages.length - 1];

      this._sceneController.load(name);
      this._sceneLoading = true;
    }
  }

  _moveToLoaded(messageBus) {
    messageBus.reset();
    this._sceneController.moveToLoaded();
    this._sceneLoading = false;
  }

  process(options) {
    const { messageBus } = options;

    if (!this._sceneLoading) {
      this._loadScene(messageBus);
    } else if (this._sceneController.isLoaded()) {
      this._moveToLoaded(messageBus);
    }
  }
}

export default SceneLoadProcessor;
