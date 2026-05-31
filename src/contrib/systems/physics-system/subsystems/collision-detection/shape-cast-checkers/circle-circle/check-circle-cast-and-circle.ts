import type { CircleCastGeometry, CircleGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCircleIntersection } from '../../raycast-checkers/ray-circle/check-ray-and-circle-intersection';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndCircle: ShapeCastCheckerFn = (query, target) => {
  const circle = query as CircleCastGeometry;
  const targetCircle = target as CircleGeometry;
  const overlapIntersection = intersectionCheckers.circle.circle(
    circle,
    targetCircle,
  );

  if (overlapIntersection) {
    const normal = overlapIntersection.normal.clone().multiplyNumber(-1);

    return buildInitialOverlapHit(overlapIntersection, {
      x: targetCircle.center.x + normal.x * targetCircle.radius,
      y: targetCircle.center.y + normal.y * targetCircle.radius,
    });
  }

  const hit = checkRayAndCircleIntersection(
    circle,
    targetCircle,
    circle.radius,
  );

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
