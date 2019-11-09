import Processor from 'engine/processor/processor';

const CONTROL_COMPONENT_NAME = 'keyboardControl';
const KILL_MSG = 'KILL';
const GAME_OVER_MSG = 'GAME_OVER';

class GameOverProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;

    this._playerGameObjects = new Set();
    this._enemiesGameObjects = new Set();
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

    if (this._playerGameObjects.size === 0 || this._enemiesGameObjects.size === 0) {
      messageBus.send({
        type: GAME_OVER_MSG,
      });
    }
  }
}

export default GameOverProcessor;
