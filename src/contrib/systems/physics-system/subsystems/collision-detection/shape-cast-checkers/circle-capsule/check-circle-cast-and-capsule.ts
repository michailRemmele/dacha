import type { CapsuleGeometry, CircleCastGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCapsuleIntersection } from '../../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndCapsule: ShapeCastCheckerFn<
  CircleCastGeometry,
  CapsuleGeometry
> = (circleCast, capsule) => {
  const overlapIntersection = intersectionCheckers.circle.capsule(
    circleCast,
    capsule,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkRayAndCapsuleIntersection(
    circleCast,
    capsule,
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
