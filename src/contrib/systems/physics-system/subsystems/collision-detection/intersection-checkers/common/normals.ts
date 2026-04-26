import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import type { Point } from '../../types';

export const orientNormal = (
  normal: Vector2,
  from: Point,
  to: Point,
): Vector2 => {
  const direction = new Vector2(to.x - from.x, to.y - from.y);

  if (VectorOps.dotProduct(direction, normal) < 0) {
    return normal.clone().multiplyNumber(-1);
  }

  return normal;
};
