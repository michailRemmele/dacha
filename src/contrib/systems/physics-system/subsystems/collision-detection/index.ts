import { ActorQuery } from '../../../../../engine/actor';
import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import { Transform, Collider } from '../../../../components';
import { AddActor, RemoveActor } from '../../../../../engine/events';
import type {
  AddActorEvent,
  RemoveActorEvent,
} from '../../../../../engine/events';
import { Pool } from '../../../../../engine/data-lib';
import type {
  PhysicsSettings,
  RaycastParams,
  CastHit,
  OverlapHit,
  OverlapParams,
  OverlapActorParams,
  ShapeCastParams,
  CastActorParams,
  CastHitCallback,
  OverlapHitCallback,
} from '../../types';

import { DynamicAABBTree } from './dynamic-aabb-tree';
import { geometryBuilders } from './geometry-builders';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
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
  raycastEach,
  overlap,
  overlapEach,
  getOverlapQueryType,
  shapeCast,
  shapeCastAll,
  shapeCastEach,
  getShapeCastQueryType,
  getActorCastQueryType,
  makeCastHit,
  makeOverlapHit,
} from './query-utils';
import type {
  Proxy,
  ActorProxy,
  QueryProxy,
  ProxyPair,
  Contact,
  Intersection,
} from './types';
import { isStatic, isDisabled } from './utils';

export class CollisionDetectionSubsystem {
  private actorQuery: ActorQuery;
  private queryTree: DynamicAABBTree<ActorProxy>;
  private proxiesByActorId: Map<string, ActorProxy>;
  private proxyPairs: ProxyPair[];
  private contacts: Contact[];
  private actorIdsToDelete: Set<string>;
  private collisionMatrix: PhysicsSettings['collisionMatrix'];
  private candidateBufferPool: Pool<ActorProxy[]>;
  private castHitPool: Pool<CastHit>;
  private overlapHitPool: Pool<OverlapHit>;

  constructor(options: SceneSystemOptions) {
    const settings = options.globalOptions.physics as
      | PhysicsSettings
      | undefined;

    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [Collider, Transform],
    });

    this.queryTree = new DynamicAABBTree();
    this.proxiesByActorId = new Map();
    this.proxyPairs = [];
    this.contacts = [];
    this.actorIdsToDelete = new Set();
    this.collisionMatrix = settings?.collisionMatrix ?? {};
    this.candidateBufferPool = new Pool<ActorProxy[]>(
      () => [],
      (buffer) => {
        buffer.length = 0;
      },
    );
    this.castHitPool = new Pool<CastHit>(makeCastHit);
    this.overlapHitPool = new Pool<OverlapHit>(makeOverlapHit);

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

    return this.withCandidates(queryProxy, (candidates) =>
      raycast(queryProxy, candidates),
    );
  }

  raycastAll(params: RaycastParams): CastHit[] {
    const queryProxy = buildQueryProxy('ray', params);

    return this.withCandidates(queryProxy, (candidates) =>
      raycastAll(queryProxy, candidates),
    );
  }

  overlapShape(params: OverlapParams): OverlapHit[] {
    const queryProxy = buildQueryProxy(params.shape.type, params);

    return this.withCandidates(queryProxy, (candidates) =>
      overlap(params.shape.type, queryProxy, candidates),
    );
  }

  overlapActor(params: OverlapActorParams): OverlapHit[] {
    const queryType = getOverlapQueryType(params);

    if (!queryType) {
      return [];
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    return this.withCandidates(queryProxy, (candidates) =>
      overlap(queryType, queryProxy, candidates),
    );
  }

  shapeCast(params: ShapeCastParams): CastHit | null {
    const queryType = getShapeCastQueryType(params);
    const queryProxy = buildQueryProxy(queryType, params);

    return this.withCandidates(queryProxy, (candidates) =>
      shapeCast(queryType, queryProxy, candidates),
    );
  }

  shapeCastAll(params: ShapeCastParams): CastHit[] {
    const queryType = getShapeCastQueryType(params);
    const queryProxy = buildQueryProxy(queryType, params);

    return this.withCandidates(queryProxy, (candidates) =>
      shapeCastAll(queryType, queryProxy, candidates),
    );
  }

  castActor(params: CastActorParams): CastHit | null {
    const queryType = getActorCastQueryType(params);

    if (!queryType) {
      return null;
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    return this.withCandidates(queryProxy, (candidates) =>
      shapeCast(queryType, queryProxy, candidates),
    );
  }

  castActorAll(params: CastActorParams): CastHit[] {
    const queryType = getActorCastQueryType(params);

    if (!queryType) {
      return [];
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    return this.withCandidates(queryProxy, (candidates) =>
      shapeCastAll(queryType, queryProxy, candidates),
    );
  }

  raycastEach(params: RaycastParams, callback: CastHitCallback): void {
    const queryProxy = buildQueryProxy('ray', params);

    this.withCandidates(queryProxy, (candidates) => {
      const hit = this.castHitPool.acquire();

      try {
        raycastEach(queryProxy, candidates, hit, callback);
      } finally {
        this.castHitPool.release(hit);
      }
    });
  }

  shapeCastEach(params: ShapeCastParams, callback: CastHitCallback): void {
    const queryType = getShapeCastQueryType(params);
    const queryProxy = buildQueryProxy(queryType, params);

    this.withCandidates(queryProxy, (candidates) => {
      const hit = this.castHitPool.acquire();

      try {
        shapeCastEach(queryType, queryProxy, candidates, hit, callback);
      } finally {
        this.castHitPool.release(hit);
      }
    });
  }

  overlapEach(params: OverlapParams, callback: OverlapHitCallback): void {
    const queryProxy = buildQueryProxy(params.shape.type, params);

    this.withCandidates(queryProxy, (candidates) => {
      const hit = this.overlapHitPool.acquire();

      try {
        overlapEach(params.shape.type, queryProxy, candidates, hit, callback);
      } finally {
        this.overlapHitPool.release(hit);
      }
    });
  }

  castActorEach(params: CastActorParams, callback: CastHitCallback): void {
    const queryType = getActorCastQueryType(params);

    if (!queryType) {
      return;
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    this.withCandidates(queryProxy, (candidates) => {
      const hit = this.castHitPool.acquire();

      try {
        shapeCastEach(queryType, queryProxy, candidates, hit, callback);
      } finally {
        this.castHitPool.release(hit);
      }
    });
  }

  overlapActorEach(
    params: OverlapActorParams,
    callback: OverlapHitCallback,
  ): void {
    const queryType = getOverlapQueryType(params);

    if (!queryType) {
      return;
    }

    const queryProxy = buildActorQueryProxy(queryType, params);

    this.withCandidates(queryProxy, (candidates) => {
      const hit = this.overlapHitPool.acquire();

      try {
        overlapEach(queryType, queryProxy, candidates, hit, callback);
      } finally {
        this.overlapHitPool.release(hit);
      }
    });
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

    this.proxiesByActorId.set(actor.id, proxy);
  }

  private updateProxy(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.shape.type](collider, transform);
    const aabb = aabbBuilders[collider.shape.type](geometry);

    const proxy = this.proxiesByActorId.get(actor.id)!;

    proxy.aabb = aabb;
    proxy.geometry = geometry;
    proxy.orientationData = getOrientationData(actor);
    proxy.layer = collider.layer;

    this.queryTree.update(proxy.treeEntryId, aabb);
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

  private withCandidates<R>(
    queryProxy: QueryProxy,
    run: (candidates: ActorProxy[]) => R,
  ): R {
    const candidates = this.candidateBufferPool.acquire();

    try {
      this.collectQueryCandidates(queryProxy, candidates);
      return run(candidates);
    } finally {
      this.candidateBufferPool.release(candidates);
    }
  }

  private collectQueryCandidates(
    queryProxy: QueryProxy,
    out: ActorProxy[],
  ): void {
    let candidateIndex = 0;

    this.queryTree.query(queryProxy.aabb, (proxy) => {
      if (queryProxy.excludedActors?.has(proxy.actor)) {
        return;
      }
      if (isDisabled(proxy)) {
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

      out[candidateIndex] = proxy;
      candidateIndex += 1;
    });

    out.length = candidateIndex;
  }

  private collectPairs(): void {
    let pairIndex = 0;

    this.proxiesByActorId.forEach((proxy) => {
      if (isStatic(proxy)) {
        return;
      }
      if (isDisabled(proxy)) {
        return;
      }

      this.queryTree.query(proxy.aabb, (other) => {
        if (other === proxy) {
          return;
        }

        // Deduplicate dynamic-dynamic pairs
        if (!isStatic(other) && proxy.treeEntryId >= other.treeEntryId) {
          return;
        }
        if (isDisabled(other)) {
          return;
        }
        if (!this.testCollisionLayers(proxy, other)) {
          return;
        }

        this.proxyPairs[pairIndex] = [proxy, other];
        pairIndex += 1;
      });
    });

    if (this.proxyPairs.length > pairIndex) {
      this.proxyPairs.length = pairIndex;
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

    this.actorIdsToDelete.forEach((id) => {
      const proxy = this.proxiesByActorId.get(id)!;

      this.queryTree.remove(proxy.treeEntryId);

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

    this.collectPairs();

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
