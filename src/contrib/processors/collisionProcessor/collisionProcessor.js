import Processor from 'engine/processor/processor';

import coordintatesCalculators from './coordinatesCalculators';
import aabbBuilders from './aabbBuilders';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

const AXIS = {
  X: 'x',
  Y: 'y',
};

const SORTING_AXIS = AXIS.X;

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

    this._sortingAxis = SORTING_AXIS;
    this._additionalAxes = Object.values(AXIS).filter((axis) => {
      return this._sortingAxis !== axis;
    });

    this._axisSortedList = [];
    this._lastProcessedGameObjects = {};
  }

  _checkOnReorientation(gameObject) {
    const gameObjectId = gameObject.getId();

    if (!this._lastProcessedGameObjects[gameObjectId]) {
      return true;
    }

    const previousTransform = this._lastProcessedGameObjects[gameObjectId];
    const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

    return transform.offsetX !== previousTransform.offsetX
      || transform.offsetY !== previousTransform.offsetY;
  }

  _addToAxisSortedList(gameObject, aabb, axis) {
    const entry = {
      gameObject: gameObject,
      aabb: aabb,
    };

    [ aabb.min[axis], aabb.max[axis] ].forEach((value) => {
      this._axisSortedList.push({
        [axis]: value,
        entry: entry,
      });
    });
  }

  _updateAxisSortedList(gameObject, aabb, axis) {
    const gameObjectId = gameObject.getId();
    const coordinates = [ aabb.min[axis], aabb.max[axis] ];

    for (let i = 0; i < this._axisSortedList.length; i++) {
      if (gameObjectId === this._axisSortedList[i].entry.gameObject.getId())  {
        this._axisSortedList[i][axis] = coordinates.shift();
        this._axisSortedList[i].entry.aabb = aabb;
        if (!coordinates.length) {
          break;
        }
      }
    }
  }

  _sweepAndPrune(axis) {
    this._axisSortedList.sort((arg1, arg2) => {
      if (arg1[axis] > arg2[axis]) {
        return 1;
      }
      if (arg1[axis] < arg2[axis]) {
        return -1;
      }
      return 0;
    });

    let collisions = this._axisSortedList.reduce((storage, item) => {
      const entry = item.entry;

      if (!storage.activeEntries.has(entry)) {
        storage.activeEntries.forEach((activeEntry) => {
          storage.collisions.push([ entry, activeEntry ]);
        });
        storage.activeEntries.add(entry);
      } else {
        storage.activeEntries.delete(entry);
      }

      return storage;
    }, { collisions: [], activeEntries: new Set() }).collisions;

    this._additionalAxes.forEach((additionalAxis) => {
      collisions = collisions.filter((pair) => {
        const aabb1 = pair[0].aabb;
        const aabb2 = pair[1].aabb;

        return aabb1.max[additionalAxis] > aabb2.min[additionalAxis]
          && aabb1.min[additionalAxis] < aabb2.max[additionalAxis];
      });
    });

    return collisions;
  }

  process(options) {
    this._gameObjectObserver.forEach((gameObject) => {
      if (!this._checkOnReorientation(gameObject)) {
        return;
      }

      const gameObjectId = gameObject.getId();
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const colliderContainer = gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);

      const coordinates = this._coordintatesCalculators[colliderContainer.type].calc(
        colliderContainer.collider,
        transform
      );
      const aabb = this._aabbBuilders[colliderContainer.type].getAABB(
        colliderContainer.collider,
        transform,
        coordinates
      );

      if (!this._lastProcessedGameObjects[gameObjectId]) {
        this._addToAxisSortedList(gameObject, aabb, this._sortingAxis);
      } else {
        this._updateAxisSortedList(gameObject, aabb, this._sortingAxis);
      }

      this._sweepAndPrune(this._sortingAxis);

      this._lastProcessedGameObjects[gameObjectId] = transform.clone();
    });
  }
}

export default CollisionProcessor;
