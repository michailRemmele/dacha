import { ActorQuery } from '../../../../../engine/actor';
import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import { Transform, Collider, RigidBody } from '../../../../components';
import { AddActor, RemoveActor } from '../../../../../engine/events';
import type {
  AddActorEvent,
  RemoveActorEvent,
} from '../../../../../engine/events';
import { insertionSort } from '../../../../../engine/data-lib';

import { DynamicAABBTree } from './dynamic-aabb-tree';
import { geometryBuilders } from './geometry-builders';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
import { DispersionCalculator } from './dispersion-calculator';
import {
  checkTransform,
  checkCollider,
  getOrientationData,
} from './reorientation-checkers';
import {
  buildQueryProxy,
  buildActorQueryProxy,
  raycast,
  raycastAll,
  overlap,
  getOverlapQueryType,
  shapeCast,
  shapeCastAll,
  getShapeCastQueryType,
  getActorCastQueryType,
} from './query-utils';
import type {
  PhysicsSettings,
  RaycastParams,
  CastHit,
  OverlapHit,
  OverlapParams,
  OverlapActorParams,
  ShapeCastParams,
  CastActorParams,
} from '../../types';
import type {
  SortedItem,
  Proxy,
  ActorProxy,
  QueryProxy,
  Axis,
  Axes,
  ProxyPair,
  Contact,
  Intersection,
} from './types';

export class CollisionDetectionSubsystem {
  private actorQuery: ActorQuery;
  private axis: Axes;
  private queryTree: DynamicAABBTree<ActorProxy>;
  private proxiesByActorId: Map<string, ActorProxy>;
  private proxyPairs: ProxyPair[];
  private contacts: Contact[];
  private actorIdsToDelete: Set<string>;
  private collisionMatrix: PhysicsSettings['collisionMatrix'];
  private queryCandidates: ActorProxy[];

  constructor(options: SceneSystemOptions) {
    const settings = options.globalOptions.physics as
      | PhysicsSettings
      | undefined;

    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [Collider, Transform],
    });

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
    this.queryTree = new DynamicAABBTree();
    this.proxiesByActorId = new Map();
    this.proxyPairs = [];
    this.contacts = [];
    this.actorIdsToDelete = new Set();
    this.collisionMatrix = settings?.collisionMatrix ?? {};
    this.queryCandidates = [];

    this.actorQuery.getActors().forEach((actor) => this.addProxy(actor));

    this.actorQuery.addEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.addEventListener(RemoveActor, this.handleActorRemove);
  }

  destroy(): void {
    this.actorQuery.removeEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.removeEventListener(RemoveActor, this.handleActorRemove);
    this.actorQuery.destroy();
    this.queryTree.clear();
  }

  raycast(params: RaycastParams): CastHit | null {
    const queryProxy = buildQueryProxy('ray', params);

    this.collectQueryCandidates(queryProxy);

    return raycast(queryProxy, this.queryCandidates);
  }

  raycastAll(params: RaycastParams): CastHit[] {
    const queryProxy = buildQueryProxy('ray', params);

    this.collectQueryCandidates(queryProxy);

    return raycastAll(queryProxy, this.queryCandidates);
  }

  overlapShape(params: OverlapParams): OverlapHit[] {
    const queryProxy = buildQueryProxy(params.shape.type, params);

    this.collectQueryCandidates(queryProxy);

    return overlap(params.shape.type, queryProxy, this.queryCandidates);
  }

  overlapActor(params: OverlapActorParams): OverlapHit[] {
    const queryType = getOverlapQueryType(params);

    if (!queryType) {
      return [];
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    this.collectQueryCandidates(queryProxy);

    return overlap(queryType, queryProxy, this.queryCandidates);
  }

  shapeCast(params: ShapeCastParams): CastHit | null {
    const queryType = getShapeCastQueryType(params);

    const queryProxy = buildQueryProxy(queryType, params);

    this.collectQueryCandidates(queryProxy);

    return shapeCast(queryType, queryProxy, this.queryCandidates);
  }

  shapeCastAll(params: ShapeCastParams): CastHit[] {
    const queryType = getShapeCastQueryType(params);

    const queryProxy = buildQueryProxy(queryType, params);

    this.collectQueryCandidates(queryProxy);

    return shapeCastAll(queryType, queryProxy, this.queryCandidates);
  }

  castActor(params: CastActorParams): CastHit | null {
    const queryType = getActorCastQueryType(params);

    if (!queryType) {
      return null;
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    this.collectQueryCandidates(queryProxy);

    return shapeCast(queryType, queryProxy, this.queryCandidates);
  }

  castActorAll(params: CastActorParams): CastHit[] {
    const queryType = getActorCastQueryType(params);

    if (!queryType) {
      return [];
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    this.collectQueryCandidates(queryProxy);

    return shapeCastAll(queryType, queryProxy, this.queryCandidates);
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    this.addProxy(event.actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    this.actorIdsToDelete.add(event.actor.id);
  };

  private checkOnReorientation(actor: Actor): boolean {
    const proxy = this.proxiesByActorId.get(actor.id);

    if (!proxy) {
      return true;
    }

    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const transformOld = proxy.orientationData.transform;
    const colliderOld = proxy.orientationData.collider;

    return (
      checkTransform(transform, transformOld) ||
      checkCollider(collider, colliderOld)
    );
  }

  private addProxy(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.shape.type](collider, transform);
    const aabb = aabbBuilders[collider.shape.type](geometry);

    const proxy = {
      actor,
      aabb,
      geometry,
      orientationData: getOrientationData(actor),
      treeEntryId: 0,
      layer: collider.layer,
    } as ActorProxy;

    proxy.treeEntryId = this.queryTree.insert(aabb, proxy);

    this.axis.x.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(proxy, 'x');

    this.axis.y.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(proxy, 'y');

    this.proxiesByActorId.set(actor.id, proxy);
  }

  private updateProxy(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.shape.type](collider, transform);
    const aabb = aabbBuilders[collider.shape.type](geometry);

    const proxy = this.proxiesByActorId.get(actor.id)!;
    const prevAABB = proxy.aabb;

    proxy.aabb = aabb;
    proxy.geometry = geometry;
    proxy.orientationData = getOrientationData(actor);
    proxy.layer = collider.layer;

    this.queryTree.update(proxy.treeEntryId, aabb);

    this.axis.x.dispersionCalculator.removeFromSample(prevAABB);
    this.axis.x.dispersionCalculator.addToSample(aabb);
    this.updateSortedList(proxy, 'x');

    this.axis.y.dispersionCalculator.removeFromSample(prevAABB);
    this.axis.y.dispersionCalculator.addToSample(aabb);
    this.updateSortedList(proxy, 'y');
  }

  private addToSortedList(proxy: ActorProxy, axis: Axis): void {
    const min = { value: proxy.aabb.min[axis], proxy };
    const max = { value: proxy.aabb.max[axis], proxy };

    this.axis[axis].sortedList.push(min, max);

    proxy.edges ??= {} as Record<Axis, [SortedItem, SortedItem]>;
    proxy.edges[axis] = [min, max];
  }

  private updateSortedList(proxy: ActorProxy, axis: Axis): void {
    const [min, max] = proxy.edges[axis];

    min.value = proxy.aabb.min[axis];
    min.proxy = proxy;

    max.value = proxy.aabb.max[axis];
    max.proxy = proxy;
  }

  private clearSortedList(axis: Axis): void {
    this.axis[axis].sortedList = this.axis[axis].sortedList.filter(
      (item) => !this.actorIdsToDelete.has(item.proxy.actor.id),
    );
  }

  private getAxes(): Axis[] {
    const xDispersion = this.axis.x.dispersionCalculator.getDispersion();
    const yDispersion = this.axis.y.dispersionCalculator.getDispersion();

    return xDispersion >= yDispersion ? ['x', 'y'] : ['y', 'x'];
  }

  private areStaticBodies(proxy1: ActorProxy, proxy2: ActorProxy): boolean {
    const { actor: actor1 } = proxy1;
    const { actor: actor2 } = proxy2;

    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    return rigidBody1?.type === 'static' && rigidBody2?.type === 'static';
  }

  private testAABB(proxy1: Proxy, proxy2: Proxy, axis: Axis): boolean {
    const aabb1 = proxy1.aabb;
    const aabb2 = proxy2.aabb;

    return (
      aabb1.max[axis] >= aabb2.min[axis] && aabb1.min[axis] <= aabb2.max[axis]
    );
  }

  private testCollisionLayers(
    proxy1: Required<Proxy>,
    proxy2: Required<Proxy>,
  ): boolean {
    return (
      this.collisionMatrix[proxy1.layer]?.[proxy2.layer] ??
      this.collisionMatrix[proxy2.layer]?.[proxy1.layer] ??
      true
    );
  }

  private testState(proxy1: Proxy, proxy2: Proxy): boolean {
    const actor1 = 'actor' in proxy1 ? proxy1.actor : undefined;
    const actor2 = 'actor' in proxy2 ? proxy2.actor : undefined;

    const collider1 = actor1?.getComponent(Collider);
    const collider2 = actor2?.getComponent(Collider);

    return !collider1?.disabled && !collider2?.disabled;
  }

  private collectQueryCandidates(queryProxy: QueryProxy): void {
    let candidateIndex = 0;

    this.queryTree.query(queryProxy.aabb, (proxy) => {
      if (queryProxy.excludedActors?.has(proxy.actor)) {
        return;
      }
      if (!this.testState(proxy, queryProxy)) {
        return;
      }
      if (
        queryProxy.layer !== undefined &&
        !this.testCollisionLayers(proxy, queryProxy as Required<QueryProxy>)
      ) {
        return;
      }
      if (queryProxy.actorFilter && !queryProxy.actorFilter(proxy.actor)) {
        return;
      }

      this.queryCandidates[candidateIndex] = proxy;
      candidateIndex += 1;
    });

    this.queryCandidates.length = candidateIndex;
  }

  private sweepAndPrune(): void {
    const [mainAxis, secondAxis] = this.getAxes();

    const { sortedList } = this.axis[mainAxis];

    insertionSort(sortedList, (arg1, arg2) => arg1.value - arg2.value);

    const activeProxies = new Set<ActorProxy>();

    let proxyPairIndex = 0;
    for (const item of sortedList) {
      const { proxy } = item;

      if (!activeProxies.has(proxy)) {
        activeProxies.forEach((activeProxy) => {
          if (!this.testState(proxy, activeProxy)) {
            return;
          }
          if (!this.testAABB(proxy, activeProxy, secondAxis)) {
            return;
          }
          if (this.areStaticBodies(proxy, activeProxy)) {
            return;
          }
          if (!this.testCollisionLayers(proxy, activeProxy)) {
            return;
          }

          this.proxyPairs[proxyPairIndex] = [proxy, activeProxy];
          proxyPairIndex += 1;
        });
        activeProxies.add(proxy);
      } else {
        activeProxies.delete(proxy);
      }
    }

    if (this.proxyPairs.length > proxyPairIndex) {
      this.proxyPairs.length = proxyPairIndex;
    }
  }

  private checkOnIntersection(proxyPair: ProxyPair): Intersection | false {
    const [proxy1, proxy2] = proxyPair;

    const type1 = proxy1.actor.getComponent(Collider).shape.type;
    const type2 = proxy2.actor.getComponent(Collider).shape.type;
    const intersectionChecker = intersectionCheckers[type1]?.[type2];

    if (!intersectionChecker) {
      return false;
    }

    return intersectionChecker(proxy1.geometry, proxy2.geometry);
  }

  private storeContact(
    contactIndex: number,
    actor1: Actor,
    actor2: Actor,
    intersection: Intersection,
  ): void {
    this.contacts[contactIndex] ??= {
      actor1,
      actor2,
      normal: intersection.normal,
      penetration: intersection.penetration,
      contactPoints: intersection.contactPoints,
    };

    this.contacts[contactIndex].actor1 = actor1;
    this.contacts[contactIndex].actor2 = actor2;
    this.contacts[contactIndex].normal = intersection.normal;
    this.contacts[contactIndex].penetration = intersection.penetration;
    this.contacts[contactIndex].contactPoints = intersection.contactPoints;
  }

  private clearDeletedProxies(): void {
    if (this.actorIdsToDelete.size === 0) {
      return;
    }

    this.clearSortedList('x');
    this.clearSortedList('y');

    this.actorIdsToDelete.forEach((id) => {
      const proxy = this.proxiesByActorId.get(id)!;

      this.queryTree.remove(proxy.treeEntryId);

      this.axis.x.dispersionCalculator.removeFromSample(proxy.aabb);
      this.axis.y.dispersionCalculator.removeFromSample(proxy.aabb);

      this.proxiesByActorId.delete(id);
    });

    this.actorIdsToDelete.clear();
  }

  update(): Contact[] {
    this.clearDeletedProxies();

    this.actorQuery.getActors().forEach((actor) => {
      if (!this.checkOnReorientation(actor)) {
        return;
      }

      this.updateProxy(actor);
    });

    this.sweepAndPrune();

    let contactIndex = 0;
    this.proxyPairs.forEach((proxyPair) => {
      const intersection = this.checkOnIntersection(proxyPair);
      if (intersection) {
        this.storeContact(
          contactIndex,
          proxyPair[0].actor,
          proxyPair[1].actor,
          intersection,
        );
        contactIndex += 1;
      }
    });

    if (this.contacts.length > contactIndex) {
      this.contacts.length = contactIndex;
    }

    return this.contacts;
  }
}
