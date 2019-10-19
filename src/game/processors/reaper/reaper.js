import Processor from 'engine/processor/processor';

const KILL_MSG = 'KILL';

const GRAVEYARD_CLEAN_FREQUENCY = 1000;

class Reaper extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectDestroyer = options.gameObjectDestroyer;
    this._allowedComponents = options.allowedComponents.reduce((storage, componentName) => {
      storage[componentName] = true;
      return storage;
    }, {});
    this._lifetime = options.lifetime;

    this._graveyard = [];
    this._timeCounter = 0;
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    const damageMessages = messageBus.get(KILL_MSG) || [];
    damageMessages.forEach((message) => {
      const { gameObject } = message;

      gameObject.getComponentNamesList().forEach((componentName) => {
        if (!this._allowedComponents[componentName]) {
          gameObject.removeComponent(componentName);
        }
      });

      this._graveyard.push({
        gameObject: gameObject,
        lifetime: this._lifetime,
      });
    });

    this._timeCounter += deltaTime;
    if (this._timeCounter >= GRAVEYARD_CLEAN_FREQUENCY) {
      this._graveyard = this._graveyard.filter((entry) => {
        entry.lifetime -= this._timeCounter;

        if (entry.lifetime <= 0) {
          this._gameObjectDestroyer.destroy(entry.gameObject);

          return false;
        }

        return true;
      });

      this._timeCounter = 0;
    }
  }
}

export default Reaper;
