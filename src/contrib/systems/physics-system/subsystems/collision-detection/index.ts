import { ActorCollection } from '../../../../../engine/actor';
import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import {
  Transform,
  Collider,
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
import { checkTransform, checkCollider } from './reorientation-checkers';
import type {
  SortedItem,
  CollisionEntry,
  Axis,
  Axes,
  CollisionPair,
  Intersection,
  OrientationData,
} from './types';

export class CollisionDetectionSubsystem {
  private actorCollection: ActorCollection;
  private scene: Scene;
  private axis: Axes;
  private entriesMap: Map<string, CollisionEntry>;
  private collisionPairs: CollisionPair[];
  private entriesToDelete: Set<string>;

  constructor(options: SceneSystemOptions) {
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        Collider,
        Transform,
      ],
    });
    this.scene = options.scene;

    this.axis = {
      x: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator('x'),
      },
      y: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator('y'),
      },
    };
    this.entriesMap = new Map();
    this.collisionPairs = [];
    this.entriesToDelete = new Set();

    this.actorCollection.forEach((actor) => this.addCollisionEntry(actor));

    this.actorCollection.addEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  destroy(): void {
    this.actorCollection.removeEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.removeEventListener(RemoveActor, this.handleActorRemove);
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    this.addCollisionEntry(event.actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    this.entriesToDelete.add(event.actor.id);
  };

  private checkOnReorientation(actor: Actor): boolean {
    const entry = this.entriesMap.get(actor.id);

    if (!entry) {
      return true;
    }

    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const transformOld = entry.orientationData.transform;
    const colliderOld = entry.orientationData.collider;

    return checkTransform(transform, transformOld) || checkCollider(collider, colliderOld);
  }

  private getOrientationData(actor: Actor): OrientationData {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    return {
      transform: {
        offsetX: transform.offsetX,
        offsetY: transform.offsetY,
        rotation: transform.rotation,
        scaleX: transform.scaleX,
        scaleY: transform.scaleY,
      },
      collider: {
        type: collider.type,
        centerX: collider.centerX,
        centerY: collider.centerY,
        sizeX: collider.sizeX,
        sizeY: collider.sizeY,
        radius: collider.radius,
      },
    };
  }

  private addCollisionEntry(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.type](
      collider,
      transform,
    );
    const aabb = aabbBuilders[collider.type](geometry);

    const entry = {
      actor,
      aabb,
      geometry,
      orientationData: this.getOrientationData(actor),
    } as CollisionEntry;

    this.axis.x.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(entry, 'x');

    this.axis.y.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(entry, 'y');

    this.entriesMap.set(actor.id, entry);
  }

  private updateCollisionEntry(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.type](
      collider,
      transform,
    );
    const aabb = aabbBuilders[collider.type](geometry);

    const entry = this.entriesMap.get(actor.id)!;
    const prevAABB = entry.aabb;

    entry.aabb = aabb;
    entry.geometry = geometry;
    entry.orientationData = this.getOrientationData(actor);

    this.axis.x.dispersionCalculator.removeFromSample(prevAABB);
    this.axis.x.dispersionCalculator.addToSample(aabb);
    this.updateSortedList(entry, 'x');

    this.axis.y.dispersionCalculator.removeFromSample(prevAABB);
    this.axis.y.dispersionCalculator.addToSample(aabb);
    this.updateSortedList(entry, 'y');
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

  private clearSortedList(axis: Axis): void {
    this.axis[axis].sortedList = this.axis[axis].sortedList.filter(
      (item) => !this.entriesToDelete.has(item.entry.actor.id),
    );
  }

  private getAxes(): Axis[] {
    const xDispersion = this.axis.x.dispersionCalculator.getDispersion();
    const yDispersion = this.axis.y.dispersionCalculator.getDispersion();

    return xDispersion >= yDispersion ? ['x', 'y'] : ['y', 'x'];
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
    const [arg1, arg2] = pair;

    const type1 = arg1.actor.getComponent(Collider).type;
    const type2 = arg2.actor.getComponent(Collider).type;

    return intersectionCheckers[type1][type2](arg1, arg2);
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

  private clearDeletedEntries(): void {
    if (this.entriesToDelete.size === 0) {
      return;
    }

    this.clearSortedList('x');
    this.clearSortedList('y');

    this.entriesToDelete.forEach((id) => {
      const entry = this.entriesMap.get(id)!;

      this.axis.x.dispersionCalculator.removeFromSample(entry.aabb);
      this.axis.y.dispersionCalculator.removeFromSample(entry.aabb);

      this.entriesMap.delete(id);
    });

    this.entriesToDelete.clear();
  }

  update(): void {
    this.clearDeletedEntries();

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
