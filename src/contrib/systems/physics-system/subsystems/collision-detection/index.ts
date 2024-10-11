import { ActorCollection } from '../../../../../engine/actor';
import type { SystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import {
  Transform,
  ColliderContainer,
  RigidBody,
} from '../../../../components';
import { AddActor, RemoveActor } from '../../../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../../../engine/events';
import { Collision } from '../../../../events';
import { insertionSort } from '../../../../../engine/data-lib';

import { geometryBuilders } from './geometry-builders';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
import { DispersionCalculator } from './dispersion-calculator';
import type { IntersectionEntry, Intersection } from './intersection-checkers';
import type {
  SortedItem,
  CollisionEntry,
  Axis,
  Axes,
  CollisionPair,
} from './types';

const AXES = ['x', 'y'] as const;

export class CollisionDetectionSubsystem {
  private actorCollection: ActorCollection;
  private scene: Scene;
  private axis: Axes;
  private entriesMap: Map<string, CollisionEntry>;
  private collisionPairs: CollisionPair[];

  constructor(options: SystemOptions) {
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        ColliderContainer,
        Transform,
      ],
    });
    this.scene = options.scene;

    this.axis = {
      [AXES[0]]: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator(AXES[0]),
      },
      [AXES[1]]: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator(AXES[1]),
      },
    };
    this.entriesMap = new Map();
    this.collisionPairs = [];
  }

  mount(): void {
    this.actorCollection.forEach((actor) => this.addCollisionEntry(actor));

    this.actorCollection.addEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  unmount(): void {
    this.actorCollection.removeEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.removeEventListener(RemoveActor, this.handleActorRemove);
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    this.addCollisionEntry(event.actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const entry = this.entriesMap.get(event.actor.id)!;

    AXES.forEach((axis) => {
      this.axis[axis].dispersionCalculator.removeFromSample(entry.aabb);
      this.removeFromSortedList(event.actor, axis);
    });

    this.entriesMap.delete(event.actor.id);
  };

  private checkOnReorientation(actor: Actor): boolean {
    const entry = this.entriesMap.get(actor.id);

    if (!entry) {
      return true;
    }

    const transform = actor.getComponent(Transform);

    return transform.offsetX !== entry.position.offsetX
      || transform.offsetY !== entry.position.offsetY;
  }

  private addCollisionEntry(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const colliderContainer = actor.getComponent(ColliderContainer);

    const geometry = geometryBuilders[colliderContainer.type](
      colliderContainer,
      transform,
    );
    const aabb = aabbBuilders[colliderContainer.type](
      colliderContainer,
      geometry,
    );
    const position = { offsetX: transform.offsetX, offsetY: transform.offsetY };

    const entry = {
      actor,
      aabb,
      geometry,
      position,
    } as CollisionEntry;

    AXES.forEach((axis) => {
      this.axis[axis].dispersionCalculator.addToSample(aabb);
      this.addToSortedList(entry, axis);
    });

    this.entriesMap.set(actor.id, entry);
  }

  private updateCollisionEntry(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const colliderContainer = actor.getComponent(ColliderContainer);

    const geometry = geometryBuilders[colliderContainer.type](
      colliderContainer,
      transform,
    );
    const aabb = aabbBuilders[colliderContainer.type](
      colliderContainer,
      geometry,
    );
    const position = { offsetX: transform.offsetX, offsetY: transform.offsetY };

    const entry = this.entriesMap.get(actor.id)!;
    const prevAABB = entry.aabb;

    entry.aabb = aabb;
    entry.geometry = geometry;
    entry.position = position;

    AXES.forEach((axis) => {
      this.axis[axis].dispersionCalculator.removeFromSample(prevAABB);
      this.axis[axis].dispersionCalculator.addToSample(aabb);

      this.updateSortedList(entry, axis);
    });
  }

  private addToSortedList(entry: CollisionEntry, axis: Axis): void {
    const min = { value: entry.aabb.min[axis], entry };
    const max = { value: entry.aabb.max[axis], entry };

    this.axis[axis].sortedList.push(min, max);

    entry.edges ??= {} as Record<Axis, [SortedItem, SortedItem]>;
    entry.edges[axis] = [min, max];
  }

  private updateSortedList(entry: CollisionEntry, axis: Axis): void {
    const [min, max] = entry.edges[axis];

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
    const xDispersion = this.axis.x.dispersionCalculator.getDispersion();
    const yDispersion = this.axis.y.dispersionCalculator.getDispersion();

    return xDispersion >= yDispersion ? [AXES[0], AXES[1]] : [AXES[1], AXES[0]];
  }

  private areStaticBodies(entry1: CollisionEntry, entry2: CollisionEntry): boolean {
    const { actor: actor1 } = entry1;
    const { actor: actor2 } = entry2;

    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    return rigidBody1?.type === 'static' && rigidBody2?.type === 'static';
  }

  private testAABB(
    entry1: CollisionEntry,
    entry2: CollisionEntry,
    axis: Axis,
  ): boolean {
    const aabb1 = entry1.aabb;
    const aabb2 = entry2.aabb;

    return aabb1.max[axis] > aabb2.min[axis] && aabb1.min[axis] < aabb2.max[axis];
  }

  private sweepAndPrune(): void {
    const [mainAxis, secondAxis] = this.getAxes();

    const { sortedList } = this.axis[mainAxis];

    insertionSort(sortedList, (arg1, arg2) => arg1.value - arg2.value);

    const activeEntries = new Set<CollisionEntry>();

    let collisionIndex = 0;
    for (const item of sortedList) {
      const { entry } = item;

      if (!activeEntries.has(entry)) {
        activeEntries.forEach((activeEntry) => {
          if (!this.testAABB(entry, activeEntry, secondAxis)) {
            return;
          }

          if (this.areStaticBodies(entry, activeEntry)) {
            return;
          }

          this.collisionPairs[collisionIndex] = [entry, activeEntry];
          collisionIndex += 1;
        });
        activeEntries.add(entry);
      } else {
        activeEntries.delete(entry);
      }
    }

    if (this.collisionPairs.length > collisionIndex) {
      this.collisionPairs.length = collisionIndex;
    }
  }

  private checkOnIntersection(pair: CollisionPair): Intersection | false {
    const getIntersectionEntry = (arg: CollisionEntry): IntersectionEntry => {
      const colliderContainer = arg.actor.getComponent(ColliderContainer);

      return {
        type: colliderContainer.type,
        collider: colliderContainer.collider,
        geometry: arg.geometry,
      };
    };

    const arg1 = getIntersectionEntry(pair[0]);
    const arg2 = getIntersectionEntry(pair[1]);

    return intersectionCheckers[arg1.type][arg2.type](arg1, arg2);
  }

  private sendCollisionEvent(
    actor1: Actor,
    actor2: Actor,
    intersection: Intersection,
  ): void {
    const { mtv1, mtv2 } = intersection;

    this.scene.dispatchEventImmediately(Collision, {
      actor1,
      actor2,
      mtv1,
      mtv2,
    });
    this.scene.dispatchEventImmediately(Collision, {
      actor1: actor2,
      actor2: actor1,
      mtv1: mtv2,
      mtv2: mtv1,
    });
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      if (!this.checkOnReorientation(actor)) {
        return;
      }

      this.updateCollisionEntry(actor);
    });

    this.sweepAndPrune();

    this.collisionPairs.forEach((pair) => {
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
