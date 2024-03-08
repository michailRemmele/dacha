import { ActorCollection } from '../../../../../engine/actor';
import type { SystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { Transform, ColliderContainer } from '../../../../components';
import { RemoveActor } from '../../../../../engine/events';
import type { RemoveActorEvent } from '../../../../../engine/events';
import { Collision } from '../../../../events';

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

export class CollisionDetectionSubsystem {
  private actorCollection: ActorCollection;
  private scene: Scene;
  private coordinatesCalculators: Record<string, CoordinatesCalculator>;
  private aabbBuilders: Record<string, AABBBuilder>;
  private intersectionCheckers: Record<string, IntersectionChecker>;
  private axis: Axes;
  private lastProcessedActors: Record<string, Transform | undefined>;

  constructor(options: SystemOptions) {
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        ColliderContainer,
        Transform,
      ],
    });
    this.scene = options.scene;
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
    this.lastProcessedActors = {};
  }

  mount(): void {
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  unmount(): void {
    this.actorCollection.removeEventListener(RemoveActor, this.handleActorRemove);
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { id } = event.actor;

    Object.values(AXIS).forEach((axis) => {
      this.axis[axis].dispersionCalculator.removeFromSample(id);
      this.removeFromSortedList(event.actor, axis);
    });

    delete this.lastProcessedActors[id];
  };

  private checkOnReorientation(actor: Actor): boolean {
    const previousTransform = this.lastProcessedActors[actor.id];

    if (!previousTransform) {
      return true;
    }

    const transform = actor.getComponent(Transform);

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
    const { actor, aabb, coordinates } = entry;

    const sortedListCoordinates = [aabb.min[axis], aabb.max[axis]];
    const { sortedList } = this.axis[axis];

    for (let i = 0; i < sortedList.length; i += 1) {
      if (actor.id === sortedList[i].entry.actor.id) {
        sortedList[i].value = sortedListCoordinates.shift() as number;
        sortedList[i].entry.aabb = aabb;
        sortedList[i].entry.coordinates = coordinates;
        if (!sortedListCoordinates.length) {
          break;
        }
      }
    }
  }

  private removeFromSortedList(actor: Actor, axis: Axis): void {
    this.axis[axis].sortedList = this.axis[axis].sortedList.filter(
      (item) => actor.id !== item.entry.actor.id,
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
      const colliderContainer = arg.actor.getComponent(ColliderContainer);

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

  private sendCollisionEvent(
    actor1: Actor,
    actor2: Actor,
    intersection: Intersection,
  ): void {
    const { mtv1, mtv2 } = intersection;

    [
      {
        actor1, actor2, mtv1, mtv2,
      },
      {
        actor1: actor2, actor2: actor1, mtv1: mtv2, mtv2: mtv1,
      },
    ].forEach((entry) => {
      this.scene.dispatchEventImmediately(Collision, {
        actor1: entry.actor1,
        actor2: entry.actor2,
        mtv1: entry.mtv1,
        mtv2: entry.mtv2,
      });
    });
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      if (!this.checkOnReorientation(actor)) {
        return;
      }

      const transform = actor.getComponent(Transform);
      const colliderContainer = actor.getComponent(ColliderContainer);

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
        this.axis[axis].dispersionCalculator.addToSample(actor.id, average);

        const entry = {
          actor,
          aabb,
          coordinates,
        };

        if (!this.lastProcessedActors[actor.id]) {
          this.addToAxisSortedList(entry, axis);
        } else {
          this.updateAxisSortedList(entry, axis);
        }
      });

      this.lastProcessedActors[actor.id] = transform.clone();
    });

    this.sweepAndPrune(this.getSortingAxis()).forEach((pair) => {
      const intersection = this.checkOnIntersection(pair);
      if (intersection) {
        this.sendCollisionEvent(
          pair[0].actor,
          pair[1].actor,
          intersection,
        );
      }
    });
  }
}
