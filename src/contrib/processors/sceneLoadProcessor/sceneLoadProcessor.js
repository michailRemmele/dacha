import Processor from 'engine/processor/processor';

const LOAD_SCENE_MSG = 'LOAD_SCENE';

class SceneLoadProcessor extends Processor {
  constructor(options) {
    super();

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

  _moveToLoaded() {
    this._sceneController.moveToLoaded();
    this._sceneLoading = false;
  }

  process(options) {
    const messageBus = options.messageBus;

    if (!this._sceneLoading) {
      this._loadScene(messageBus);
    } else if (this._sceneController.isLoaded()) {
      this._moveToLoaded();
    }
  }
}

export default SceneLoadProcessor;
