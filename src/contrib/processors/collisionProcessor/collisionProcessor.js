import Processor from 'engine/processor/processor';

import coordintatesCalculators from './coordinatesCalculators';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

class CollisionProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._coordintatesCalculators = Object.keys(coordintatesCalculators).reduce((storage, key) => {
      const CoordinatesCalculator = coordintatesCalculators[key];
      storage[key] = new CoordinatesCalculator();
      return storage;
    }, {});
  }

  process(options) {
    const colliders = this._gameObjectObserver.map((gameObject) => {
      const colliderContainer = gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

      return this._coordintatesCalculators[colliderContainer.type].calc(
        colliderContainer.collider,
        transform
      );
    });
  }
}

export default CollisionProcessor;
