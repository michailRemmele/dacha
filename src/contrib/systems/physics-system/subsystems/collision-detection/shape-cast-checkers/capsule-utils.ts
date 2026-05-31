import { checkRayAndCapsuleIntersection } from '../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
import type { CapsuleCastGeometry, Point, RayGeometry } from '../types';
import type { ShapeCastCheckerHit } from './types';

export const checkReverseRayAndCapsule = (
  capsule: CapsuleCastGeometry,
  point: Point,
  targetRadius = 0,
): ShapeCastCheckerHit | false => {
  const ray: RayGeometry = {
    origin: point,
    direction: capsule.direction.clone().multiplyNumber(-1),
    maxDistance: capsule.maxDistance,
  };
  const hit = checkRayAndCapsuleIntersection(ray, capsule, targetRadius);

  if (!hit) {
    return false;
  }

  hit.normal.multiplyNumber(-1);
  hit.point.x = point.x + hit.normal.x * targetRadius;
  hit.point.y = point.y + hit.normal.y * targetRadius;

  return hit;
};
