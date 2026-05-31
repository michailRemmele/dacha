import type { CircleCastGeometry, CircleGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCircleIntersection } from '../../raycast-checkers/ray-circle/check-ray-and-circle-intersection';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndCircle: ShapeCastCheckerFn<
  CircleCastGeometry,
  CircleGeometry
> = (circleCast, circle) => {
  const overlapIntersection = intersectionCheckers.circle.circle(
    circleCast,
    circle,
  );

  if (overlapIntersection) {
    const normal = overlapIntersection.normal.clone().multiplyNumber(-1);

    return buildInitialOverlapHit(overlapIntersection, {
      x: circle.center.x + normal.x * circle.radius,
      y: circle.center.y + normal.y * circle.radius,
    });
  }

  const hit = checkRayAndCircleIntersection(
    circleCast,
    circle,
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
