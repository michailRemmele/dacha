import Processor from 'engine/processor/processor';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

class CollisionProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    this._gameObjectObserver.forEach((gameObject) => {
      const colliderContainer = gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
      // console.log(colliderContainer.collider);
    });
  }
}

export default CollisionProcessor;
