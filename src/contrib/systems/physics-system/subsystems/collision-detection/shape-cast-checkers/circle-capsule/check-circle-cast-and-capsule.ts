import type {
  CapsuleGeometry,
  CircleCastGeometry,
  QueryProxy,
} from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { raycastCheckers } from '../../raycast-checkers';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndCapsule: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.circle.capsule(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const circle = queryProxy.geometry as CircleCastGeometry;
  const capsule = targetProxy.geometry as CapsuleGeometry;
  const inflatedCapsuleProxy: QueryProxy = {
    aabb: targetProxy.aabb,
    geometry: {
      ...capsule,
      radius: capsule.radius + circle.radius,
    },
    layer: targetProxy.layer,
  };

  const hit = raycastCheckers.ray.capsule(queryProxy, inflatedCapsuleProxy);

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
