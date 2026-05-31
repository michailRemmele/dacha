import type { BoxGeometry, CircleCastGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCapsuleIntersection } from '../../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import type { ShapeCastCheckerFn } from '../types';
import type { RaycastCheckerHit } from '../../raycast-checkers/types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndBox: ShapeCastCheckerFn<
  CircleCastGeometry,
  BoxGeometry
> = (circleCast, box) => {
  const overlapIntersection = intersectionCheckers.circle.box(circleCast, box);

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: RaycastCheckerHit | false = false;

  for (const edge of box.edges) {
    nearest = chooseNearestIntersection(
      nearest,
      checkRayAndCapsuleIntersection(circleCast, edge, circleCast.radius),
    );
  }

  if (!nearest) {
    return false;
  }

  nearest.point = {
    x: nearest.point.x - nearest.normal.x * circleCast.radius,
    y: nearest.point.y - nearest.normal.y * circleCast.radius,
  };

  return nearest;
};
