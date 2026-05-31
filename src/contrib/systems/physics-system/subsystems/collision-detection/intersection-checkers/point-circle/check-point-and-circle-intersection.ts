import { Vector2 } from '../../../../../../../engine/math-lib';
import type { CircleGeometry, PointGeometry, Intersection } from '../../types';
import { isGreaterThan } from '../../utils';

/**
 * Checks point and circle colliders for intersection.
 *
 * The manifold uses the nearest point on the circle boundary as the contact.
 * When the point lies at the circle center, the X axis is used as a
 * deterministic fallback.
 */
export const checkPointAndCircleIntersection = (
  point: PointGeometry,
  circle: CircleGeometry,
): Intersection | false => {
  const offsetX = point.center.x - circle.center.x;
  const offsetY = point.center.y - circle.center.y;
  const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);

  if (isGreaterThan(distance, circle.radius)) {
    return false;
  }

  const normal =
    distance === 0
      ? new Vector2(1, 0)
      : new Vector2(offsetX, offsetY).normalize();

  return {
    normal,
    penetration: Math.max(0, circle.radius - distance),
    contactPoints: [
      {
        x: circle.center.x + normal.x * circle.radius,
        y: circle.center.y + normal.y * circle.radius,
      },
    ],
  };
};
