import type { Actor } from '../../../../../engine/actor';
import { Collider, Transform } from '../../../../components';
import type {
  RaycastParams,
  OverlapParams,
  ShapeCastParams,
  CastActorParams,
  CastHit,
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
  | 'ray'
  | 'circleCast'
  | 'capsuleCast'
  | 'boxCast';
type OverlapQueryType = 'point' | 'circle' | 'box' | 'capsule';
type ShapeCastQueryType = 'circleCast' | 'capsuleCast' | 'boxCast';
type QueryGeometry =
  | BoxGeometry
  | BoxCastGeometry
  | CircleGeometry
  | CapsuleGeometry
  | PointGeometry
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

export function buildActorCastProxy(
  type: ShapeCastQueryType,
  params: CastActorParams,
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
): Actor[] => {
  const actors: Actor[] = [];

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);
    const intersection = intersectionCheckers[type][collider.shape.type](
      queryProxy.geometry,
      proxy.geometry,
    );

    if (intersection) {
      actors.push(proxy.actor);
    }
  }

  return actors;
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
