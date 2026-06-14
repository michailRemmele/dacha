import type { Actor } from '../../../../../engine/actor';
import { Collider, Transform } from '../../../../components';
import type {
  RaycastParams,
  OverlapParams,
  OverlapActorParams,
  ShapeCastParams,
  CastActorParams,
  CastHit,
  OverlapHit,
} from '../../types';

import type {
  ActorProxy,
  QueryProxy,
  BoxGeometry,
  BoxCastGeometry,
  CircleGeometry,
  CircleCastGeometry,
  CapsuleCastGeometry,
  PointGeometry,
  RayGeometry,
  CapsuleGeometry,
  SegmentGeometry,
} from './types';
import { geometryBuilders } from './geometry-builders';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
import { raycastCheckers } from './raycast-checkers';
import type { RaycastCheckerHit } from './raycast-checkers/types';
import { shapeCastCheckers } from './shape-cast-checkers';
import type { ShapeCastCheckerHit } from './shape-cast-checkers/types';

type QueryType =
  | 'point'
  | 'circle'
  | 'box'
  | 'capsule'
  | 'segment'
  | 'ray'
  | 'circleCast'
  | 'capsuleCast'
  | 'boxCast';
type OverlapQueryType = 'point' | 'circle' | 'box' | 'capsule' | 'segment';
type ShapeCastQueryType = 'circleCast' | 'capsuleCast' | 'boxCast';
type QueryGeometry =
  | BoxGeometry
  | BoxCastGeometry
  | CircleGeometry
  | CapsuleGeometry
  | PointGeometry
  | SegmentGeometry
  | RayGeometry
  | CircleCastGeometry
  | CapsuleCastGeometry;
type QueryParams = OverlapParams | RaycastParams | ShapeCastParams;

type GeometryBulders = Record<
  QueryType,
  (
    colliderOrParams: Collider | unknown,
    transform?: Transform,
    params?: unknown,
  ) => QueryGeometry
>;

export function buildQueryProxy(
  type: QueryType,
  params: QueryParams,
): QueryProxy {
  const geometry = (geometryBuilders as GeometryBulders)[type](params);

  return {
    aabb: aabbBuilders[type](geometry),
    geometry,
    layer: params.layer,
    excludedActors: params.excludeActors
      ? new Set(params.excludeActors)
      : undefined,
  };
}

export function buildActorQueryProxy(
  type: ShapeCastQueryType,
  params: CastActorParams,
): QueryProxy;
export function buildActorQueryProxy(
  type: OverlapQueryType,
  params: OverlapActorParams,
): QueryProxy;
export function buildActorQueryProxy(
  type: ShapeCastQueryType | OverlapQueryType,
  params: CastActorParams | OverlapActorParams,
): QueryProxy {
  const { actor, excludeSelf = true, excludeActors } = params;

  const transform = actor.getComponent(Transform);
  const collider = actor.getComponent(Collider);

  const geometry = (geometryBuilders as GeometryBulders)[type](
    collider,
    transform,
    params,
  );

  const excludedActors = new Set(excludeActors);
  if (excludeSelf) {
    excludedActors.add(actor);
  }

  return {
    aabb: aabbBuilders[type](geometry),
    geometry,
    layer: params.layer ?? collider.layer,
    excludedActors,
  };
}

export const getOverlapQueryType = (
  params: OverlapActorParams,
): OverlapQueryType | null => {
  const collider = params.actor.getComponent(Collider) as Collider | undefined;

  return collider ? collider.shape.type : null;
};

export const getShapeCastQueryType = (
  params: ShapeCastParams,
): ShapeCastQueryType => {
  switch (params.shape.type) {
    case 'circle':
      return 'circleCast';
    case 'capsule':
      return 'capsuleCast';
    case 'box':
      return 'boxCast';
  }
};

export const getActorCastQueryType = (
  params: CastActorParams,
): ShapeCastQueryType | null => {
  const collider = params.actor.getComponent(Collider) as Collider | undefined;

  switch (collider?.shape.type) {
    case 'circle':
      return 'circleCast';
    case 'capsule':
      return 'capsuleCast';
    case 'box':
      return 'boxCast';
    default:
      return null;
  }
};

export const overlap = (
  type: OverlapQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): OverlapHit[] => {
  const hits: OverlapHit[] = [];

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);
    const checker = intersectionCheckers[type]?.[collider.shape.type];

    if (!checker) {
      continue;
    }

    const intersection = checker(queryProxy.geometry, proxy.geometry);

    if (intersection) {
      hits.push({
        actor: proxy.actor,
        normal: intersection.normal.clone().multiplyNumber(-1),
        penetration: intersection.penetration,
        contactPoints: intersection.contactPoints,
      });
    }
  }

  return hits;
};

export const raycast = (
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit | null => {
  let nearestHit: RaycastCheckerHit | null = null;
  let nearestActor: Actor | null = null;
  let nearestDistance = Infinity;

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);

    const hit = raycastCheckers.ray[collider.shape.type](
      queryProxy.geometry as RayGeometry,
      proxy.geometry,
    );

    if (hit && hit.distance < nearestDistance) {
      nearestHit = hit;
      nearestActor = proxy.actor;
      nearestDistance = hit.distance;
    }
  }

  if (!nearestHit || !nearestActor) {
    return null;
  }

  return {
    actor: nearestActor,
    point: nearestHit.point,
    normal: nearestHit.normal,
    distance: nearestDistance,
  };
};

export const raycastAll = (
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit[] => {
  const hits: CastHit[] = [];

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);

    const hit = raycastCheckers.ray[collider.shape.type](
      queryProxy.geometry as RayGeometry,
      proxy.geometry,
    );

    if (hit) {
      hits.push({
        actor: proxy.actor,
        point: hit.point,
        normal: hit.normal,
        distance: hit.distance,
      });
    }
  }

  hits.sort((arg1, arg2) => arg1.distance - arg2.distance);

  return hits;
};

export const shapeCast = (
  type: ShapeCastQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit | null => {
  let nearestCastHit: ShapeCastCheckerHit | null = null;
  let nearestActor: Actor | null = null;
  let nearestDistance = Infinity;

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);

    const checker = shapeCastCheckers[type]?.[collider.shape.type];

    if (!checker) {
      continue;
    }

    const castHit = checker(queryProxy.geometry, proxy.geometry);

    if (castHit && castHit.distance < nearestDistance) {
      nearestCastHit = castHit;
      nearestActor = proxy.actor;
      nearestDistance = castHit.distance;
    }
  }

  if (!nearestCastHit || !nearestActor) {
    return null;
  }

  return {
    actor: nearestActor,
    point: nearestCastHit.point,
    normal: nearestCastHit.normal,
    distance: nearestCastHit.distance,
  };
};

export const shapeCastAll = (
  type: ShapeCastQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit[] => {
  const hits: CastHit[] = [];

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);
    const checker = shapeCastCheckers[type]?.[collider.shape.type];

    if (!checker) {
      continue;
    }

    const castHit = checker(queryProxy.geometry, proxy.geometry);

    if (castHit) {
      hits.push({
        actor: proxy.actor,
        point: castHit.point,
        normal: castHit.normal,
        distance: castHit.distance,
      });
    }
  }

  hits.sort((arg1, arg2) => arg1.distance - arg2.distance);

  return hits;
};
