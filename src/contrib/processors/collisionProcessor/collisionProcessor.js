import Processor from 'engine/processor/processor';

import coordintatesCalculators from './coordinatesCalculators';
import aabbBuilders from './aabbBuilders';
import DispersionCalculator from './dispersionCalculator/dispersionCalculator';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

const AXIS = {
  X: 'x',
  Y: 'y',
};

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

    this._axis = {
      [AXIS.X]: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator(),
      },
      [AXIS.Y]: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator(),
      },
    };
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
      this._axis[axis].sortedList.push({
        [axis]: value,
        entry: entry,
      });
    });
  }

  _updateAxisSortedList(gameObject, aabb, axis) {
    const gameObjectId = gameObject.getId();
    const coordinates = [ aabb.min[axis], aabb.max[axis] ];
    const sortedList = this._axis[axis].sortedList;

    for (let i = 0; i < sortedList.length; i++) {
      if (gameObjectId === sortedList[i].entry.gameObject.getId())  {
        sortedList[i][axis] = coordinates.shift();
        sortedList[i].entry.aabb = aabb;
        if (!coordinates.length) {
          break;
        }
      }
    }
  }

  _removeFromSortedList(gameObject, axis) {
    const gameObjectId = gameObject.getId();

    this._axis[axis].sortedList = this._axis[axis].sortedList.filter((item) => {
      return gameObjectId !== item.entry.gameObject.getId();
    });
  }

  _getSortingAxis() {
    const xAxisDispersion = this._axis[AXIS.X].dispersionCalculator.getDispersion();
    const yAxisDispersion = this._axis[AXIS.Y].dispersionCalculator.getDispersion();

    return xAxisDispersion >= yAxisDispersion ? AXIS.X : AXIS.Y;
  }

  _sweepAndPrune(mainAxis) {
    const sortedList = this._axis[mainAxis].sortedList;
    const additionalAxes = Object.values(AXIS).filter((axis) => {
      return mainAxis !== axis;
    });

    sortedList.sort((arg1, arg2) => {
      if (arg1[mainAxis] > arg2[mainAxis]) {
        return 1;
      }
      if (arg1[mainAxis] < arg2[mainAxis]) {
        return -1;
      }
      return 0;
    });

    let collisions = sortedList.reduce((storage, item) => {
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

    additionalAxes.forEach((additionalAxis) => {
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
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      Object.values(AXIS).forEach((axis) => {
        this._axis[axis].dispersionCalculator.removeFromSample(gameObjectId);
        this._removeFromSortedList(gameObject, axis);
      });

      this._lastProcessedGameObjects[gameObjectId] = null;
    });

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

      Object.values(AXIS).forEach((axis) => {
        const average = (aabb.min[axis] + aabb.max[axis]) * 0.5;
        this._axis[axis].dispersionCalculator.addToSample(gameObjectId, average);

        if (!this._lastProcessedGameObjects[gameObjectId]) {
          this._addToAxisSortedList(gameObject, aabb, axis);
        } else {
          this._updateAxisSortedList(gameObject, aabb, axis);
        }
      });

      this._lastProcessedGameObjects[gameObjectId] = transform.clone();
    });

    const collidedPairs = this._sweepAndPrune(this._getSortingAxis());
    // console.log(collidedPairs);
  }
}

export default CollisionProcessor;
