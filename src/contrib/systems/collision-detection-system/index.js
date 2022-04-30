import coordintatesCalculators from './coordinatesCalculators';
import aabbBuilders from './aabbBuilders';
import intersectionCheckers from './intersectionCheckers';
import DispersionCalculator from './dispersionCalculator/dispersionCalculator';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

const AXIS = {
  X: 'x',
  Y: 'y',
};

const COLLISION_MESSAGE = 'COLLISION';

export class CollisionDetectionSystem {
  constructor(options) {
    this._gameObjectObserver = options.createGameObjectObserver({
      components: [
        COLLIDER_CONTAINER_COMPONENT_NAME,
        TRANSFORM_COMPONENT_NAME,
      ],
    });
    this.messageBus = options.messageBus;
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
    this._intersectionCheckers = Object.keys(intersectionCheckers).reduce((storage, key) => {
      const IntersectionChecker = intersectionCheckers[key];
      storage[key] = new IntersectionChecker();
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

  mount() {
    this._gameObjectObserver.subscribe('onremove', this._handleGameObjectRemove);
  }

  unmount() {
    this._gameObjectObserver.unsubscribe('onremove', this._handleGameObjectRemove);
  }

  _handleGameObjectRemove = (gameObject) => {
    const gameObjectId = gameObject.getId();

    Object.values(AXIS).forEach((axis) => {
      this._axis[axis].dispersionCalculator.removeFromSample(gameObjectId);
      this._removeFromSortedList(gameObject, axis);
    });

    this._lastProcessedGameObjects[gameObjectId] = null;
  };

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

  _addToAxisSortedList(entry, axis) {
    [entry.aabb.min[axis], entry.aabb.max[axis]].forEach((value) => {
      this._axis[axis].sortedList.push({
        [axis]: value,
        entry,
      });
    });
  }

  _updateAxisSortedList(entry, axis) {
    const { gameObject, aabb, coordinates } = entry;

    const gameObjectId = gameObject.getId();
    const sortedListCoordinates = [aabb.min[axis], aabb.max[axis]];
    const { sortedList } = this._axis[axis];

    for (let i = 0; i < sortedList.length; i += 1) {
      if (gameObjectId === sortedList[i].entry.gameObject.getId()) {
        sortedList[i][axis] = sortedListCoordinates.shift();
        sortedList[i].entry.aabb = aabb;
        sortedList[i].entry.coordinates = coordinates;
        if (!sortedListCoordinates.length) {
          break;
        }
      }
    }
  }

  _removeFromSortedList(gameObject, axis) {
    const gameObjectId = gameObject.getId();

    this._axis[axis].sortedList = this._axis[axis].sortedList.filter(
      (item) => gameObjectId !== item.entry.gameObject.getId(),
    );
  }

  _getSortingAxis() {
    const xAxisDispersion = this._axis[AXIS.X].dispersionCalculator.getDispersion();
    const yAxisDispersion = this._axis[AXIS.Y].dispersionCalculator.getDispersion();

    return xAxisDispersion >= yAxisDispersion ? AXIS.X : AXIS.Y;
  }

  _sweepAndPrune(mainAxis) {
    const { sortedList } = this._axis[mainAxis];
    const additionalAxes = Object.values(AXIS).filter((axis) => mainAxis !== axis);

    sortedList.sort((arg1, arg2) => {
      if (arg1[mainAxis] > arg2[mainAxis]) {
        return 1;
      }
      if (arg1[mainAxis] < arg2[mainAxis]) {
        return -1;
      }
      return 0;
    });

    let { collisions } = sortedList.reduce((storage, item) => {
      const { entry } = item;

      if (!storage.activeEntries.has(entry)) {
        storage.activeEntries.forEach((activeEntry) => {
          storage.collisions.push([entry, activeEntry]);
        });
        storage.activeEntries.add(entry);
      } else {
        storage.activeEntries.delete(entry);
      }

      return storage;
    }, { collisions: [], activeEntries: new Set() });

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

  _checkOnIntersection(pair) {
    const getIntersectionEntry = (arg) => {
      const colliderContainer = arg.gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);

      return {
        colliderType: colliderContainer.type,
        collider: colliderContainer.collider,
        coordinates: arg.coordinates,
      };
    };

    const arg1 = getIntersectionEntry(pair[0]);
    const arg2 = getIntersectionEntry(pair[1]);

    const intersectionType = `${arg1.colliderType}_${arg2.colliderType}`;

    return this._intersectionCheckers[intersectionType].check(arg1, arg2);
  }

  _sendCollisionMessage(gameObject1, gameObject2, intersection) {
    const { mtv1, mtv2 } = intersection;

    [
      {
        gameObject1, gameObject2, mtv1, mtv2,
      },
      {
        gameObject1: gameObject2, gameObject2: gameObject1, mtv1: mtv2, mtv2: mtv1,
      },
    ].forEach((entry) => {
      this.messageBus.send({
        type: COLLISION_MESSAGE,
        gameObject1: entry.gameObject1,
        gameObject2: entry.gameObject2,
        mtv1: entry.mtv1,
        mtv2: entry.mtv2,
      });
    });
  }

  update() {
    this._gameObjectObserver.fireEvents();

    this._gameObjectObserver.forEach((gameObject) => {
      if (!this._checkOnReorientation(gameObject)) {
        return;
      }

      const gameObjectId = gameObject.getId();
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const colliderContainer = gameObject.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);

      const coordinates = this._coordintatesCalculators[colliderContainer.type].calc(
        colliderContainer.collider,
        transform,
      );
      const aabb = this._aabbBuilders[colliderContainer.type].getAABB(
        colliderContainer.collider,
        coordinates,
      );

      Object.values(AXIS).forEach((axis) => {
        const average = (aabb.min[axis] + aabb.max[axis]) * 0.5;
        this._axis[axis].dispersionCalculator.addToSample(gameObjectId, average);

        const entry = {
          gameObject,
          aabb,
          coordinates,
        };

        if (!this._lastProcessedGameObjects[gameObjectId]) {
          this._addToAxisSortedList(entry, axis);
        } else {
          this._updateAxisSortedList(entry, axis);
        }
      });

      this._lastProcessedGameObjects[gameObjectId] = transform.clone();
    });

    this._sweepAndPrune(this._getSortingAxis()).forEach((pair) => {
      const intersection = this._checkOnIntersection(pair);
      if (intersection) {
        this._sendCollisionMessage(
          pair[0].gameObject, pair[1].gameObject, intersection,
        );
      }
    });
  }
}
