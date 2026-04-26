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

import { geometryBuilders } from './geometry-builders';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
import { DispersionCalculator } from './dispersion-calculator';
import { checkTransform, checkCollider } from './reorientation-checkers';
import { buildQueryProxy, raycast, raycastAll, overlap } from './query-utils';
import type {
  PhysicsSettings,
  RaycastParams,
  RaycastHit,
  OverlapPointParams,
  OverlapCircleParams,
  OverlapBoxParams,
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
  OrientationData,
} from './types';

export class CollisionDetectionSubsystem {
  private actorQuery: ActorQuery;
  private axis: Axes;
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
  }

  raycast(params: RaycastParams): RaycastHit | null {
    const queryProxy = buildQueryProxy('ray', params);

    this.sweepAndPruneQuery(queryProxy);

    return raycast(queryProxy, this.queryCandidates);
  }

  raycastAll(params: RaycastParams): RaycastHit[] {
    const queryProxy = buildQueryProxy('ray', params);

    this.sweepAndPruneQuery(queryProxy);

    return raycastAll(queryProxy, this.queryCandidates);
  }

  overlapPoint(params: OverlapPointParams): Actor[] {
    const queryProxy = buildQueryProxy('point', params);

    this.sweepAndPruneQuery(queryProxy);

    return overlap('point', queryProxy, this.queryCandidates);
  }

  overlapCircle(params: OverlapCircleParams): Actor[] {
    const queryProxy = buildQueryProxy('circle', params);

    this.sweepAndPruneQuery(queryProxy);

    return overlap('circle', queryProxy, this.queryCandidates);
  }

  overlapBox(params: OverlapBoxParams): Actor[] {
    const queryProxy = buildQueryProxy('box', params);

    this.sweepAndPruneQuery(queryProxy);

    return overlap('box', queryProxy, this.queryCandidates);
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

  private getOrientationData(actor: Actor): OrientationData {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    return {
      transform: {
        positionX: transform.world.position.x,
        positionY: transform.world.position.y,
        rotation: transform.world.rotation,
        scaleX: transform.world.scale.x,
        scaleY: transform.world.scale.y,
      },
      collider: {
        type: collider.type,
        layer: collider.layer,
        centerX: collider.centerX,
        centerY: collider.centerY,
        sizeX: collider.sizeX,
        sizeY: collider.sizeY,
        radius: collider.radius,
        point1: collider.point1 ? { ...collider.point1 } : undefined,
        point2: collider.point2 ? { ...collider.point2 } : undefined,
      },
    };
  }

  private addProxy(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.type](collider, transform);
    const aabb = aabbBuilders[collider.type](geometry);

    const proxy = {
      actor,
      aabb,
      geometry,
      orientationData: this.getOrientationData(actor),
      layer: collider.layer,
    } as ActorProxy;

    this.axis.x.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(proxy, 'x');

    this.axis.y.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(proxy, 'y');

    this.proxiesByActorId.set(actor.id, proxy);
  }

  private updateProxy(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.type](collider, transform);
    const aabb = aabbBuilders[collider.type](geometry);

    const proxy = this.proxiesByActorId.get(actor.id)!;
    const prevAABB = proxy.aabb;

    proxy.aabb = aabb;
    proxy.geometry = geometry;
    proxy.orientationData = this.getOrientationData(actor);
    proxy.layer = collider.layer;

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
    return this.collisionMatrix[proxy1.layer]?.[proxy2.layer] ?? true;
  }

  private sweepAndPruneQuery(queryProxy: QueryProxy): void {
    const [mainAxis, secondAxis] = this.getAxes();
    const sortedList = this.axis[mainAxis].sortedList;

    const candidates = new Set<ActorProxy>();

    for (const item of sortedList) {
      const { proxy, value } = item;

      if (value < queryProxy.aabb.min[mainAxis]) {
        if (candidates.has(proxy)) {
          candidates.delete(proxy);
        } else {
          candidates.add(proxy);
        }

        continue;
      }

      if (value > queryProxy.aabb.max[mainAxis]) {
        break;
      }

      if (!candidates.has(proxy)) {
        candidates.add(proxy);
      }
    }

    let candidateIndex = 0;
    candidates.forEach((proxy) => {
      if (!this.testAABB(proxy, queryProxy, secondAxis)) {
        return;
      }
      if (
        queryProxy.layer !== undefined &&
        !this.testCollisionLayers(proxy, queryProxy as Required<QueryProxy>)
      ) {
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

    const type1 = proxy1.actor.getComponent(Collider).type;
    const type2 = proxy2.actor.getComponent(Collider).type;
    const intersectionChecker = intersectionCheckers[type1]?.[type2];

    if (!intersectionChecker) {
      return false;
    }

    return intersectionChecker(proxy1, proxy2);
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
