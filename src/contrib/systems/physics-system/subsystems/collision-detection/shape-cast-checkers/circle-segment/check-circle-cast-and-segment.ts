import type {
  CircleCastGeometry,
  QueryProxy,
  SegmentGeometry,
} from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { raycastCheckers } from '../../raycast-checkers';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndSegment: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.circle.segment(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const circle = queryProxy.geometry as CircleCastGeometry;
  const segment = targetProxy.geometry as SegmentGeometry;
  const capsuleProxy: QueryProxy = {
    aabb: targetProxy.aabb,
    geometry: {
      ...segment,
      radius: circle.radius,
    },
    layer: targetProxy.layer,
  };

  const hit = raycastCheckers.ray.capsule(queryProxy, capsuleProxy);

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
