import { Vector2 } from '../../../../../../../engine/math-lib';
import type { Proxy, CircleGeometry, Intersection } from '../../types';
import { INTERSECTION_EPSILON } from '../utils';

/**
 * Checks circles for intersection.
 *
 * The manifold is straightforward:
 * - the normal follows the line between circle centers
 * - penetration is the overlap of the radii along that line
 * - the contact point lies on the surface of the first circle
 *
 * When both centers are equal, the X axis is used as a deterministic fallback.
 */
export const checkCirclesIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const { radius: radius1 } = arg1.geometry as CircleGeometry;
  const { radius: radius2 } = arg2.geometry as CircleGeometry;
  const { x: x1, y: y1 } = arg1.geometry.center;
  const { x: x2, y: y2 } = arg2.geometry.center;

  const offsetX = x2 - x1;
  const offsetY = y2 - y1;
  const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);

  if (distance > radius1 + radius2 + INTERSECTION_EPSILON) {
    return false;
  }

  const penetration = Math.max(0, radius1 + radius2 - distance);

  if (distance === 0) {
    return {
      normal: new Vector2(1, 0),
      penetration,
      contactPoints: [
        {
          x: x1 + radius1,
          y: y1,
        },
      ],
    };
  }

  const normal = new Vector2(offsetX, offsetY);
  normal.normalize();

  return {
    normal,
    penetration,
    contactPoints: [
      {
        x: x1 + normal.x * radius1,
        y: y1 + normal.y * radius1,
      },
    ],
  };
};
