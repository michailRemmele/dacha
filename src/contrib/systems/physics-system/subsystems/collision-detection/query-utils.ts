import type { Actor } from '../../../../../engine/actor';
import { Collider } from '../../../../components';
import type {
  OverlapBoxParams,
  OverlapCircleParams,
  OverlapPointParams,
  RaycastParams,
  RaycastHit,
} from '../../types';

import type {
  ActorProxy,
  QueryProxy,
  BoxGeometry,
  CircleGeometry,
  PointGeometry,
  RayGeometry,
  Intersection,
} from './types';
import { geometryBuilders } from './geometry-builders';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';

type QueryType = 'point' | 'circle' | 'box' | 'ray';
type QueryGeometry = BoxGeometry | CircleGeometry | PointGeometry | RayGeometry;
type QueryParams =
  | OverlapBoxParams
  | OverlapCircleParams
  | OverlapPointParams
  | RaycastParams;

type GeometryBulders = Record<QueryType, (params: unknown) => QueryGeometry>;

export function buildQueryProxy(
  type: QueryType,
  params: QueryParams,
): QueryProxy {
  const geometry = (geometryBuilders as GeometryBulders)[type](params);

  return {
    aabb: aabbBuilders[type](geometry),
    geometry,
    layer: params.layer,
  };
}

export const overlap = (
  type: QueryType,
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): Actor[] => {
  const actors: Actor[] = [];

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);
    const intersection = intersectionCheckers[type][collider.type](
      queryProxy,
      proxy,
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
): RaycastHit | null => {
  let nearestIntersection: Intersection | null = null;
  let nearestActor: Actor | null = null;
  let nearestDistance = Infinity;

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);

    const intersection = intersectionCheckers.ray[collider.type](
      queryProxy,
      proxy,
    );

    if (intersection && intersection.distance! < nearestDistance) {
      nearestIntersection = intersection;
      nearestActor = proxy.actor;
      nearestDistance = intersection.distance!;
    }
  }

  if (!nearestIntersection || !nearestActor) {
    return null;
  }

  return {
    actor: nearestActor,
    point: nearestIntersection.contactPoints[0],
    normal: nearestIntersection.normal,
    distance: nearestDistance,
  };
};

export const raycastAll = (
  queryProxy: QueryProxy,
  proxies: Iterable<ActorProxy>,
): RaycastHit[] => {
  const hits: RaycastHit[] = [];

  for (const proxy of proxies) {
    const collider = proxy.actor.getComponent(Collider);

    const intersection = intersectionCheckers.ray[collider.type](
      queryProxy,
      proxy,
    );

    if (intersection) {
      hits.push({
        actor: proxy.actor,
        point: intersection.contactPoints[0],
        normal: intersection.normal,
        distance: intersection.distance!,
      });
    }
  }

  hits.sort((arg1, arg2) => arg1.distance - arg2.distance);

  return hits;
};
