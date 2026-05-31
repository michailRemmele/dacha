import type { CircleCastGeometry, SegmentGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCapsuleIntersection } from '../../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
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

  const hit = checkRayAndCapsuleIntersection(circle, segment, circle.radius);

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
