import { COLLISION_MSG } from '../../consts';
import type { System, SystemOptions } from '../../../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../../../engine/game-object';
import type { MessageBus } from '../../../../../engine/message-bus';
import { Transform, ColliderContainer } from '../../../../components';

import { coordinatesCalculators } from './coordinates-calculators';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
import { DispersionCalculator } from './dispersion-calculator';
import type { CoordinatesCalculator } from './coordinates-calculators';
import type { AABBBuilder } from './aabb-builders';
import type { IntersectionChecker, IntersectionEntry, Intersection } from './intersection-checkers';
import type {
  SortedEntry,
  Axis,
  Axes,
  CollisionPair,
} from './types';

const AXIS = {
  X: 'x',
  Y: 'y',
} as const;

export class CollisionDetectionSubsystem implements System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;
  private coordinatesCalculators: Record<string, CoordinatesCalculator>;
  private aabbBuilders: Record<string, AABBBuilder>;
  private intersectionCheckers: Record<string, IntersectionChecker>;
  private axis: Axes;
  private lastProcessedGameObjects: Record<string, Transform | undefined>;

  constructor(options: SystemOptions) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        ColliderContainer,
        Transform,
      ],
    });
    this.messageBus = options.messageBus;
    this.coordinatesCalculators = Object.keys(coordinatesCalculators).reduce((storage, key) => {
      const CoordinatesCalculator = coordinatesCalculators[key];
      storage[key] = new CoordinatesCalculator();
      return storage;
    }, {} as Record<string, CoordinatesCalculator>);
    this.aabbBuilders = Object.keys(aabbBuilders).reduce((storage, key) => {
      const AABBBuilder = aabbBuilders[key];
      storage[key] = new AABBBuilder();
      return storage;
    }, {} as Record<string, AABBBuilder>);
    this.intersectionCheckers = Object.keys(intersectionCheckers).reduce((storage, key) => {
      const IntersectionChecker = intersectionCheckers[key];
      storage[key] = new IntersectionChecker();
      return storage;
    }, {} as Record<string, IntersectionChecker>);

    this.axis = {
      [AXIS.X]: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator(),
      },
      [AXIS.Y]: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator(),
      },
    };
    this.lastProcessedGameObjects = {};
  }

  mount(): void {
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  unmount(): void {
    this.gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);
  }

  private handleGameObjectRemove = (gameObject: GameObject): void => {
    const gameObjectId = gameObject.getId();

    Object.values(AXIS).forEach((axis) => {
      this.axis[axis].dispersionCalculator.removeFromSample(gameObjectId);
      this.removeFromSortedList(gameObject, axis);
    });

    delete this.lastProcessedGameObjects[gameObjectId];
  };

  private checkOnReorientation(gameObject: GameObject): boolean {
    const gameObjectId = gameObject.getId();
    const previousTransform = this.lastProcessedGameObjects[gameObjectId];

    if (!previousTransform) {
      return true;
    }

    const transform = gameObject.getComponent(Transform);

    return transform.offsetX !== previousTransform.offsetX
      || transform.offsetY !== previousTransform.offsetY;
  }

  private addToAxisSortedList(entry: SortedEntry, axis: Axis): void {
    [entry.aabb.min[axis], entry.aabb.max[axis]].forEach((value) => {
      this.axis[axis].sortedList.push({
        value,
        entry,
      });
    });
  }

  private updateAxisSortedList(entry: SortedEntry, axis: Axis): void {
    const { gameObject, aabb, coordinates } = entry;

    const gameObjectId = gameObject.getId();
    const sortedListCoordinates = [aabb.min[axis], aabb.max[axis]];
    const { sortedList } = this.axis[axis];

    for (let i = 0; i < sortedList.length; i += 1) {
      if (gameObjectId === sortedList[i].entry.gameObject.getId()) {
        sortedList[i].value = sortedListCoordinates.shift() as number;
        sortedList[i].entry.aabb = aabb;
        sortedList[i].entry.coordinates = coordinates;
        if (!sortedListCoordinates.length) {
          break;
        }
      }
    }
  }

  private removeFromSortedList(gameObject: GameObject, axis: Axis): void {
    const gameObjectId = gameObject.getId();

    this.axis[axis].sortedList = this.axis[axis].sortedList.filter(
      (item) => gameObjectId !== item.entry.gameObject.getId(),
    );
  }

  private getSortingAxis(): Axis {
    const xAxisDispersion = this.axis[AXIS.X].dispersionCalculator.getDispersion();
    const yAxisDispersion = this.axis[AXIS.Y].dispersionCalculator.getDispersion();

    return xAxisDispersion >= yAxisDispersion ? AXIS.X : AXIS.Y;
  }

  private sweepAndPrune(mainAxis: Axis): Array<CollisionPair> {
    const { sortedList } = this.axis[mainAxis];
    const additionalAxes = Object.values(AXIS).filter((axis) => mainAxis !== axis);

    sortedList.sort((arg1, arg2) => {
      if (arg1.value > arg2.value) {
        return 1;
      }
      if (arg1.value < arg2.value) {
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
    }, { collisions: [] as Array<CollisionPair>, activeEntries: new Set<SortedEntry>() });

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

  private checkOnIntersection(pair: CollisionPair): Intersection | false {
    const getIntersectionEntry = (arg: SortedEntry): IntersectionEntry => {
      const colliderContainer = arg.gameObject.getComponent(ColliderContainer);

      return {
        type: colliderContainer.type,
        collider: colliderContainer.collider,
        coordinates: arg.coordinates,
      };
    };

    const arg1 = getIntersectionEntry(pair[0]);
    const arg2 = getIntersectionEntry(pair[1]);

    const intersectionType = `${arg1.type}_${arg2.type}`;

    return this.intersectionCheckers[intersectionType].check(arg1, arg2);
  }

  private sendCollisionMessage(
    gameObject1: GameObject,
    gameObject2: GameObject,
    intersection: Intersection,
  ): void {
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
        type: COLLISION_MSG,
        gameObject1: entry.gameObject1,
        gameObject2: entry.gameObject2,
        mtv1: entry.mtv1,
        mtv2: entry.mtv2,
      });
    });
  }

  update(): void {
    this.gameObjectObserver.fireEvents();

    this.gameObjectObserver.forEach((gameObject) => {
      if (!this.checkOnReorientation(gameObject)) {
        return;
      }

      const gameObjectId = gameObject.getId();
      const transform = gameObject.getComponent(Transform);
      const colliderContainer = gameObject.getComponent(ColliderContainer);

      const coordinates = this.coordinatesCalculators[colliderContainer.type].calc(
        colliderContainer,
        transform,
      );
      const aabb = this.aabbBuilders[colliderContainer.type].getAABB(
        colliderContainer,
        coordinates,
      );

      Object.values(AXIS).forEach((axis) => {
        const average = (aabb.min[axis] + aabb.max[axis]) * 0.5;
        this.axis[axis].dispersionCalculator.addToSample(gameObjectId, average);

        const entry = {
          gameObject,
          aabb,
          coordinates,
        };

        if (!this.lastProcessedGameObjects[gameObjectId]) {
          this.addToAxisSortedList(entry, axis);
        } else {
          this.updateAxisSortedList(entry, axis);
        }
      });

      this.lastProcessedGameObjects[gameObjectId] = transform.clone();
    });

    this.sweepAndPrune(this.getSortingAxis()).forEach((pair) => {
      const intersection = this.checkOnIntersection(pair);
      if (intersection) {
        this.sendCollisionMessage(
          pair[0].gameObject,
          pair[1].gameObject,
          intersection,
        );
      }
    });
  }
}
