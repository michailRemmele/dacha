import type { Vector2 } from '../../../../../../../engine/math-lib';
import type { Point } from '../../types';

export const orientNormal = (
  normal: Vector2,
  from: Point,
  to: Point,
): Vector2 => {
  const directionX = to.x - from.x;
  const directionY = to.y - from.y;

  if (directionX * normal.x + directionY * normal.y < 0) {
    return normal.clone().multiplyNumber(-1);
  }

  return normal;
};
