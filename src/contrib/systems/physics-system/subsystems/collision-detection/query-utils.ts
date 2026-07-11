import { Vector2 } from '../../../../../engine/math-lib';
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
import { shapeCastCheckers } from './shape-cast-checkers';

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
    excludedActors: params.excludeActors?.length
      ? new Set(params.excludeActors)
      : undefined,
    actorFilter: params.actorFilter,
    hitFilter: params.hitFilter as (hit: OverlapHit | CastHit) => boolean,
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
    actorFilter: params.actorFilter,
    hitFilter: params.hitFilter as (hit: OverlapHit | CastHit) => boolean,
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

export const makeCastHit = (): CastHit => ({
  actor: undefined as unknown as CastHit['actor'],
  point: { x: 0, y: 0 },
  normal: new Vector2(0, 0),
  distance: 0,
});

const cloneCastHit = (hit: CastHit): CastHit => ({
  actor: hit.actor,
  point: hit.point,
  normal: hit.normal,
  distance: hit.distance,
});

export const makeOverlapHit = (): OverlapHit => ({
  actor: undefined as unknown as OverlapHit['actor'],
  normal: new Vector2(0, 0),
  penetration: 0,
  contactPoints: [],
});

const cloneOverlapHit = (hit: OverlapHit): OverlapHit => ({
  actor: hit.actor,
  normal: hit.normal,
  penetration: hit.penetration,
  contactPoints: hit.contactPoints,
});

export const overlap = (
  type: OverlapQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): OverlapHit[] => {
  const scratch = makeOverlapHit();
  const hits: OverlapHit[] = [];

  overlapEach(type, queryProxy, proxies, scratch, (hit) => {
    hits.push(cloneOverlapHit(hit));
  });

  return hits;
};

export const raycast = (
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit | null => {
  const scratch = makeCastHit();
  let nearestDistance = Infinity;
  let nearestHit: CastHit | null = null;

  raycastEach(queryProxy, proxies, scratch, (hit) => {
    if (hit.distance < nearestDistance) {
      nearestDistance = hit.distance;
      nearestHit = nearestHit ?? makeCastHit();
      nearestHit.actor = hit.actor;
      nearestHit.point = hit.point;
      nearestHit.normal = hit.normal;
      nearestHit.distance = hit.distance;
    }
  });

  return nearestHit;
};

export const raycastAll = (
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit[] => {
  const scratch = makeCastHit();
  const hits: CastHit[] = [];

  raycastEach(queryProxy, proxies, scratch, (hit) => {
    hits.push(cloneCastHit(hit));
  });

  hits.sort((arg1, arg2) => arg1.distance - arg2.distance);

  return hits;
};

export const shapeCast = (
  type: ShapeCastQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit | null => {
  const scratch = makeCastHit();
  let nearestDistance = Infinity;
  let nearestHit: CastHit | null = null;

  shapeCastEach(type, queryProxy, proxies, scratch, (hit) => {
    if (hit.distance < nearestDistance) {
      nearestDistance = hit.distance;
      nearestHit = nearestHit ?? makeCastHit();
      nearestHit.actor = hit.actor;
      nearestHit.point = hit.point;
      nearestHit.normal = hit.normal;
      nearestHit.distance = hit.distance;
    }
  });

  return nearestHit;
};

export const shapeCastAll = (
  type: ShapeCastQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): CastHit[] => {
  const scratch = makeCastHit();
  const hits: CastHit[] = [];

  shapeCastEach(type, queryProxy, proxies, scratch, (hit) => {
    hits.push(cloneCastHit(hit));
  });

  hits.sort((arg1, arg2) => arg1.distance - arg2.distance);

  return hits;
};

export const raycastEach = (
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
  hit: CastHit,
  callback: (hit: CastHit) => void,
): void => {
  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);

    const result = raycastCheckers.ray[collider.shape.type](
      queryProxy.geometry as RayGeometry,
      proxy.geometry,
    );

    if (!result) {
      continue;
    }

    hit.actor = proxy.actor;
    hit.point = result.point;
    hit.normal = result.normal;
    hit.distance = result.distance;

    if (queryProxy.hitFilter && !queryProxy.hitFilter(hit)) {
      continue;
    }

    callback(hit);
  }
};

export const shapeCastEach = (
  type: ShapeCastQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
  hit: CastHit,
  callback: (hit: CastHit) => void,
): void => {
  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);
    const checker = shapeCastCheckers[type]?.[collider.shape.type];

    if (!checker) {
      continue;
    }

    const result = checker(queryProxy.geometry, proxy.geometry);

    if (!result) {
      continue;
    }

    hit.actor = proxy.actor;
    hit.point = result.point;
    hit.normal = result.normal;
    hit.distance = result.distance;

    if (queryProxy.hitFilter && !queryProxy.hitFilter(hit)) {
      continue;
    }

    callback(hit);
  }
};

export const overlapEach = (
  type: OverlapQueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
  hit: OverlapHit,
  callback: (hit: OverlapHit) => void,
): void => {
  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);
    const checker = intersectionCheckers[type]?.[collider.shape.type];

    if (!checker) {
      continue;
    }

    const intersection = checker(queryProxy.geometry, proxy.geometry);

    if (!intersection) {
      continue;
    }

    intersection.normal.multiplyNumber(-1);

    hit.actor = proxy.actor;
    hit.normal = intersection.normal;
    hit.penetration = intersection.penetration;
    hit.contactPoints = intersection.contactPoints;

    if (queryProxy.hitFilter && !queryProxy.hitFilter(hit)) {
      continue;
    }

    callback(hit);
  }
};
