import type {
  CapsuleGeometry,
  CircleCastGeometry,
} from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { raycastCheckers } from '../../raycast-checkers';
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

  const inflatedCapsule: CapsuleGeometry = {
    ...capsule,
    radius: capsule.radius + circle.radius,
  };

  const hit = raycastCheckers.ray.capsule(circle, inflatedCapsule);

  if (!hit) {
    return false;
  }

  hit.point = {
    x: hit.point.x - hit.normal.x * circle.radius,
    y: hit.point.y - hit.normal.y * circle.radius,
  };

  return hit;
};
