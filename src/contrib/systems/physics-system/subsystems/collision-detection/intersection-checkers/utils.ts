import { Vector2, VectorOps } from '../../../../../../engine/math-lib';
import type { Point } from '../types';

export const INTERSECTION_EPSILON = 1e-6;

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

export interface Projection {
  min: number;
  max: number;
}

export const projectPolygon = (points: Point[], axis: Vector2): Projection => {
  let min = VectorOps.dotProduct(points[0], axis);
  let max = min;

  for (let i = 1; i < points.length; i += 1) {
    const value = VectorOps.dotProduct(points[i], axis);

    if (value < min) {
      min = value;
    } else if (value > max) {
      max = value;
    }
  }

  return { min, max };
};
