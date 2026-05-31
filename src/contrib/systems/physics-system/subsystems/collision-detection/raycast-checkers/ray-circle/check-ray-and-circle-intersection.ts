import { Vector2 } from '../../../../../../../engine/math-lib';
import type { CircleGeometry } from '../../types';
import {
  isGreaterThan,
  isDefinitelyNegative,
  isDefinitelyPositive,
} from '../../utils';
import type { RaycastCheckerFn } from '../types';

/**
 * Checks a ray against a circle.
 *
 * The ray/circle equation is solved in parametric form. The first valid
 * distance on the finite ray is used as the contact point. When the ray
 * starts at the circle center, the normal falls back to the opposite ray
 * direction.
 */
export const checkRayAndCircleIntersection: RaycastCheckerFn<CircleGeometry> = (
  ray,
  circle,
) => {
  const offsetX = ray.origin.x - circle.center.x;
  const offsetY = ray.origin.y - circle.center.y;
  const b = offsetX * ray.direction.x + offsetY * ray.direction.y;
  const c = offsetX ** 2 + offsetY ** 2 - circle.radius ** 2;

  if (isDefinitelyPositive(c) && b > 0) {
    return false;
  }

  const discriminant = b ** 2 - c;
  if (isDefinitelyNegative(discriminant)) {
    return false;
  }

  const hitDistance = Math.max(0, -b - Math.sqrt(Math.max(0, discriminant)));

  if (isGreaterThan(hitDistance, ray.maxDistance)) {
    return false;
  }

  const hitPoint = {
    x: ray.origin.x + ray.direction.x * hitDistance,
    y: ray.origin.y + ray.direction.y * hitDistance,
  };

  const normal = new Vector2(
    hitPoint.x - circle.center.x,
    hitPoint.y - circle.center.y,
  ).normalize();

  if (normal.magnitude === 0) {
    normal.x = -ray.direction.x;
    normal.y = -ray.direction.y;
  }

  return {
    normal,
    distance: hitDistance,
    point: hitPoint,
  };
};
