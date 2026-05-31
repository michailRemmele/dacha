import type { BoxGeometry, CircleCastGeometry } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { checkRayAndCapsuleIntersection } from '../../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import type { ShapeCastCheckerFn } from '../types';
import type { RaycastCheckerHit } from '../../raycast-checkers/types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndBox: ShapeCastCheckerFn = (query, target) => {
  const circle = query as CircleCastGeometry;
  const box = target as BoxGeometry;
  const overlapIntersection = intersectionCheckers.circle.box(circle, box);

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: RaycastCheckerHit | false = false;

  for (const edge of box.edges) {
    nearest = chooseNearestIntersection(
      nearest,
      checkRayAndCapsuleIntersection(circle, edge, circle.radius),
    );
  }

  if (!nearest) {
    return false;
  }

  nearest.point = {
    x: nearest.point.x - nearest.normal.x * circle.radius,
    y: nearest.point.y - nearest.normal.y * circle.radius,
  };

  return nearest;
};
