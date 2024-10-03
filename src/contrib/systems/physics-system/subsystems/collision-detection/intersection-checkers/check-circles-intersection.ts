import { Vector2 } from '../../../../../../engine/math-lib';
import type { CircleCollider } from '../../../../../components/collider-container/circle-collider';

import type {
  IntersectionEntry,
  Intersection,
} from './types';

/**
  * Checks circles at the intersection.
  * Steps of the alghorith:
  * 1. Calculate distance between circles centers.
  * 2. If distance greater or equal to summ of circles radiuses then is no intersection.
  * 3. If distance is zero then circles centers lie at the same point, so just X axis used for mtv.
  * 4. If distance less than summ of circles radiuses and it's non-zero
  *  then circles centers used to get the axis.
  */
export const checkCirclesIntersection = (
  arg1: IntersectionEntry,
  arg2: IntersectionEntry,
): Intersection | false => {
  const { radius: rArg1 } = arg1.collider as CircleCollider;
  const { radius: rArg2 } = arg2.collider as CircleCollider;
  const { x: xArg1, y: yArg1 } = arg1.geometry.center;
  const { x: xArg2, y: yArg2 } = arg2.geometry.center;

  const x = xArg1 - xArg2;
  const y = yArg1 - yArg2;
  const distance = Math.sqrt((x ** 2) + (y ** 2));

  if (distance >= rArg1 + rArg2) {
    return false;
  }

  if (distance === 0) {
    return {
      mtv1: new Vector2(rArg1 + rArg2, 0),
      mtv2: new Vector2(-(rArg1 + rArg2), 0),
    };
  }

  const mtv = new Vector2(x, y);
  const overlap = rArg1 + rArg2 - distance;
  mtv.multiplyNumber((1 / distance) * overlap);

  const positiveX = Math.abs(mtv.x);
  const negativeX = -Math.abs(mtv.x);
  const positiveY = Math.abs(mtv.y);
  const negativeY = -Math.abs(mtv.y);

  return {
    mtv1: new Vector2(
      xArg1 < xArg2 ? negativeX : positiveX,
      yArg1 < yArg2 ? negativeY : positiveY,
    ),
    mtv2: new Vector2(
      xArg2 < xArg1 ? negativeX : positiveX,
      yArg2 < yArg1 ? negativeY : positiveY,
    ),
  };
};
