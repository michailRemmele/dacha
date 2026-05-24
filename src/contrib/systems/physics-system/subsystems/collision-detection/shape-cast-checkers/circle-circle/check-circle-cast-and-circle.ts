import type {
  CircleCastGeometry,
  CircleGeometry,
  QueryProxy,
} from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { raycastCheckers } from '../../raycast-checkers';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndCircle: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.circle.circle(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    const target = targetProxy.geometry as CircleGeometry;
    const normal = overlapIntersection.normal.clone().multiplyNumber(-1);

    return buildInitialOverlapHit(overlapIntersection, {
      x: target.center.x + normal.x * target.radius,
      y: target.center.y + normal.y * target.radius,
    });
  }

  const circle = queryProxy.geometry as CircleCastGeometry;
  const target = targetProxy.geometry as CircleGeometry;
  const inflatedCircleProxy: QueryProxy = {
    aabb: targetProxy.aabb,
    geometry: {
      center: target.center,
      radius: target.radius + circle.radius,
    },
    layer: targetProxy.layer,
  };

  const hit = raycastCheckers.ray.circle(queryProxy, inflatedCircleProxy);

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
