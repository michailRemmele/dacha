import { Vector2 } from '../../../../../../../engine/math-lib';
import type {
  Proxy,
  CircleGeometry,
  PointGeometry,
  Intersection,
} from '../../types';
import { orientNormal, INTERSECTION_EPSILON } from '../utils';

/**
 * Checks point and circle colliders for intersection.
 *
 * The manifold uses the nearest point on the circle boundary as the contact.
 * When the point lies at the circle center, the X axis is used as a
 * deterministic fallback.
 */
export const checkPointAndCircleIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const isCircleFirst = 'radius' in arg1.geometry;
  const circle = (
    isCircleFirst ? arg1.geometry : arg2.geometry
  ) as CircleGeometry;
  const point = (
    isCircleFirst ? arg2.geometry : arg1.geometry
  ) as PointGeometry;

  const offsetX = point.center.x - circle.center.x;
  const offsetY = point.center.y - circle.center.y;
  const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);

  if (distance > circle.radius + INTERSECTION_EPSILON) {
    return false;
  }

  const normal =
    distance === 0
      ? new Vector2(1, 0)
      : new Vector2(offsetX, offsetY).normalize();

  return {
    normal: orientNormal(
      normal,
      (arg1.geometry as CircleGeometry | PointGeometry).center,
      (arg2.geometry as CircleGeometry | PointGeometry).center,
    ),
    penetration: Math.max(0, circle.radius - distance),
    contactPoints: [
      {
        x: circle.center.x + normal.x * circle.radius,
        y: circle.center.y + normal.y * circle.radius,
      },
    ],
  };
};
