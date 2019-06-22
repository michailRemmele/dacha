import Processor from 'engine/processor/processor';

import coordintatesCalculators from './coordinatesCalculators';
import aabbBuilders from './aabbBuilders';

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
    this._aabbBuilders = Object.keys(aabbBuilders).reduce((storage, key) => {
      const AABBBuilder = aabbBuilders[key];
      storage[key] = new AABBBuilder();
      return storage;
    }, {});
  }

  process(options) {
    const aabbs = this._gameObjectObserver.map((gameObject) => {
      const colliderContainer = gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

      const coordinates = this._coordintatesCalculators[colliderContainer.type].calc(
        colliderContainer.collider,
        transform
      );
      return this._aabbBuilders[colliderContainer.type].getAABB(
        colliderContainer.collider,
        transform,
        coordinates
      );
    });

    // console.log(aabbs);
  }
}

export default CollisionProcessor;
