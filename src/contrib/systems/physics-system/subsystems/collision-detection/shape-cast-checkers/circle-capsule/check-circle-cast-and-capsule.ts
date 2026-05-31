import type { CapsuleGeometry, CircleCastGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCapsuleIntersection } from '../../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndCapsule: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const circle = query as CircleCastGeometry;
  const capsule = target as CapsuleGeometry;
  const overlapIntersection = intersectionCheckers.circle.capsule(
    circle,
    capsule,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkRayAndCapsuleIntersection(circle, capsule, circle.radius);

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
