import Processor from 'engine/processor/processor';

const SHOT_MSG = 'SHOT';

const TRANSFORM_COMPONENT_NAME = 'transform';

class ShootingProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;
  }

  process(options) {
    const messageBus = options.messageBus;

    const messages = messageBus.get(SHOT_MSG) || [];
    messages.forEach((message) => {
      const gameObject = message.gameObject;
      const gameObjectTransform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

      const bullet = this._gameObjectSpawner.spawn('blasterBullet');
      const bulletTransform = bullet.getComponent(TRANSFORM_COMPONENT_NAME);

      bulletTransform.offsetX = gameObjectTransform.offsetX;
      bulletTransform.offsetY = gameObjectTransform.offsetY;
    });
  }
}

export default ShootingProcessor;
