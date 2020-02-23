import Processor from 'engine/processor/processor';

import aiStrategies from './aiStrategies';

const AI_COMPONENT_NAME = 'ai';

class AIProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;

    this.playersStrategies = {};
  }

  _processAddedGameObjects() {
    this._gameObjectObserver.getLastAdded().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const ai = gameObject.getComponent(AI_COMPONENT_NAME);

      this.playersStrategies[gameObjectId] = new aiStrategies[ai.strategy](gameObject, this._store);
    });
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    this._processAddedGameObjects();

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this.playersStrategies[gameObjectId].update(messageBus, deltaTime);
    });
  }
}

export default AIProcessor;
