import type { CircleCastGeometry, SegmentGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCapsuleIntersection } from '../../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndSegment: ShapeCastCheckerFn<
  CircleCastGeometry,
  SegmentGeometry
> = (circleCast, segment) => {
  const overlapIntersection = intersectionCheckers.circle.segment(
    circleCast,
    segment,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkRayAndCapsuleIntersection(
    circleCast,
    segment,
    circleCast.radius,
  );

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circleCast.radius,
    y: hit.point.y - hit.normal.y * circleCast.radius,
  };

  return hit;
};
