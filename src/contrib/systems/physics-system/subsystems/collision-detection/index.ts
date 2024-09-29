import { ActorCollection } from '../../../../../engine/actor';
import type { SystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { Transform, ColliderContainer } from '../../../../components';
import { RemoveActor } from '../../../../../engine/events';
import type { RemoveActorEvent } from '../../../../../engine/events';
import { Collision } from '../../../../events';
import { insertionSort } from '../../../../../engine/data-lib';

import { coordinatesCalculators } from './coordinates-calculators';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
import { DispersionCalculator } from './dispersion-calculator';
import { PairTracker } from './pair-tracker';
import type { CoordinatesCalculator } from './coordinates-calculators';
import type { AABBBuilder } from './aabb-builders';
import type { IntersectionChecker, IntersectionEntry, Intersection } from './intersection-checkers';
import type {
  SortedItem,
  CollisionEntry,
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
  private sortedEntriesMap: Record<string, Record<string, [SortedItem, SortedItem]>>;

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
    this.sortedEntriesMap = {};
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

    delete this.sortedEntriesMap[id];
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

  private addToAxisSortedList(entry: CollisionEntry, axis: Axis): void {
    const min = { value: entry.aabb.min[axis], entry };
    const max = { value: entry.aabb.max[axis], entry };

    this.axis[axis].sortedList.push(min, max);

    this.sortedEntriesMap[entry.actor.id] ??= {};
    this.sortedEntriesMap[entry.actor.id][axis] = [min, max];
  }

  private updateAxisSortedList(entry: CollisionEntry, axis: Axis): void {
    const [min, max] = this.sortedEntriesMap[entry.actor.id][axis];

    min.value = entry.aabb.min[axis];
    min.entry = entry;

    max.value = entry.aabb.max[axis];
    max.entry = entry;
  }

  private removeFromSortedList(actor: Actor, axis: Axis): void {
    this.axis[axis].sortedList = this.axis[axis].sortedList.filter(
      (item) => actor.id !== item.entry.actor.id,
    );
  }

  private getAxes(): Axis[] {
    const xDispersion = this.axis[AXIS.X].dispersionCalculator.getDispersion();
    const yDispersion = this.axis[AXIS.Y].dispersionCalculator.getDispersion();

    return xDispersion >= yDispersion ? [AXIS.X, AXIS.Y] : [AXIS.Y, AXIS.X];
  }

  private sweepAndPrune(axis: Axis, pairTracker: PairTracker): void {
    const { sortedList } = this.axis[axis];

    insertionSort(sortedList, (arg1, arg2) => arg1.value - arg2.value);

    const activeEntries = new Set<CollisionEntry>();
    for (const item of sortedList) {
      const { entry } = item;

      if (!pairTracker.canCollide(entry)) {
        continue;
      }

      if (!activeEntries.has(entry)) {
        activeEntries.forEach((activeEntry) => {
          pairTracker.add(activeEntry, entry);
        });
        activeEntries.add(entry);
      } else {
        activeEntries.delete(entry);
      }
    }
  }

  private checkOnIntersection(pair: CollisionPair): Intersection | false {
    const getIntersectionEntry = (arg: CollisionEntry): IntersectionEntry => {
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

      const entry = { actor, aabb, coordinates };
      Object.values(AXIS).forEach((axis) => {
        const average = (aabb.min[axis] + aabb.max[axis]) * 0.5;
        this.axis[axis].dispersionCalculator.addToSample(actor.id, average);

        if (!this.lastProcessedActors[actor.id]) {
          this.addToAxisSortedList(entry, axis);
        } else {
          this.updateAxisSortedList(entry, axis);
        }
      });

      this.lastProcessedActors[actor.id] = transform.clone();
    });

    const pairTracker = new PairTracker();
    this.getAxes().forEach((axis, index) => {
      if (index !== 0) {
        pairTracker.swap();
      }
      this.sweepAndPrune(axis, pairTracker);
    });
    pairTracker.values().forEach((pair) => {
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
