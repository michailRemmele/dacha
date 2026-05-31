import { raycastCheckers } from '../raycast-checkers';
import type {
  CapsuleCastGeometry,
  CapsuleGeometry,
  Point,
  RayGeometry,
} from '../types';
import type { ShapeCastCheckerHit } from './types';

export const checkReversePointCastAndCapsule = (
  capsule: CapsuleCastGeometry,
  point: Point,
  targetRadius = 0,
): ShapeCastCheckerHit | false => {
  const inflatedCapsule: CapsuleGeometry = {
    center: capsule.center,
    point1: capsule.point1,
    point2: capsule.point2,
    normal: capsule.normal,
    radius: capsule.radius + targetRadius,
  };
  const ray: RayGeometry = {
    origin: point,
    direction: capsule.direction.clone().multiplyNumber(-1),
    maxDistance: capsule.maxDistance,
  };
  const hit = raycastCheckers.ray.capsule(ray, inflatedCapsule);

  if (!hit) {
    return false;
  }

  const normal = hit.normal.multiplyNumber(-1);

  return {
    distance: hit.distance,
    normal,
    point: {
      x: point.x + normal.x * targetRadius,
      y: point.y + normal.y * targetRadius,
    },
  };
};
