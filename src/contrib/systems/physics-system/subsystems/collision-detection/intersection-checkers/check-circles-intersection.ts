import { Vector2 } from '../../../../../../engine/math-lib';
import type { Proxy, CircleGeometry, Intersection } from '../types';

/**
 * Checks circles at the intersection.
 * Steps of the alghorith:
 * 1. Calculate distance between circles centers.
 * 2. If distance greater or equal to summ of circles radiuses then is no intersection.
 * 3. If distance is zero then circles centers lie at the same point, so X axis is used as a fallback normal.
 * 4. If distance less than summ of circles radiuses and it's non-zero
 *  then circles centers used to get the axis.
 */
export const checkCirclesIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const { radius: rArg1 } = arg1.geometry as CircleGeometry;
  const { radius: rArg2 } = arg2.geometry as CircleGeometry;
  const { x: xArg1, y: yArg1 } = arg1.geometry.center;
  const { x: xArg2, y: yArg2 } = arg2.geometry.center;

  const x = xArg2 - xArg1;
  const y = yArg2 - yArg1;
  const distance = Math.sqrt(x ** 2 + y ** 2);

  if (distance >= rArg1 + rArg2) {
    return false;
  }

  const penetration = rArg1 + rArg2 - distance;

  if (distance === 0) {
    return {
      normal: new Vector2(1, 0),
      penetration,
      contactPoints: [
        {
          x: xArg1 + rArg1,
          y: yArg1,
        },
      ],
    };
  }

  const normal = new Vector2(x, y);
  normal.normalize();

  return {
    normal,
    penetration,
    contactPoints: [
      {
        x: xArg1 + normal.x * rArg1,
        y: yArg1 + normal.y * rArg1,
      },
    ],
  };
};
