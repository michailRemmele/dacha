import type {
  CapsuleGeometry,
  CircleCastGeometry,
  SegmentGeometry,
} from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { raycastCheckers } from '../../raycast-checkers';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndSegment: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const circle = query as CircleCastGeometry;
  const segment = target as SegmentGeometry;
  const overlapIntersection = intersectionCheckers.circle.segment(
    circle,
    segment,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const capsule: CapsuleGeometry = {
    ...segment,
    radius: circle.radius,
  };

  const hit = raycastCheckers.ray.capsule(circle, capsule);

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
