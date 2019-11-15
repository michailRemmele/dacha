import Processor from 'engine/processor/processor';

const CONTROL_COMPONENT_NAME = 'keyboardControl';
const KILL_MSG = 'KILL';
const LOAD_SCENE_MSG = 'LOAD_SCENE';

class GameOverProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._restartScene = options.restartScene;

    this._playerGameObjects = new Set();
    this._enemiesGameObjects = new Set();
    this._isGameOver = false;
  }

  processorDidMount() {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const control = gameObject.getComponent(CONTROL_COMPONENT_NAME);

      if (control) {
        this._playerGameObjects.add(gameObjectId);
      } else {
        this._enemiesGameObjects.add(gameObjectId);
      }
    });
  }

  process(options) {
    const messageBus = options.messageBus;

    const messages = messageBus.get(KILL_MSG) || [];
    messages.forEach((message) => {
      const { gameObject } = message;

      [ this._playerGameObjects, this._enemiesGameObjects ].forEach((gameObjects) => {
        gameObjects.delete(gameObject.getId());
      });
    });

    if (
      !this._isGameOver
      && (this._playerGameObjects.size === 0 || this._enemiesGameObjects.size === 0)
    ) {
      this._isGameOver = true;

      messageBus.send({
        type: LOAD_SCENE_MSG,
        name: this._restartScene,
      });
    }
  }
}

export default GameOverProcessor;
