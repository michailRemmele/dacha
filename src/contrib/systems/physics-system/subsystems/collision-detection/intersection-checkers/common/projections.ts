import { VectorOps, type Vector2 } from '../../../../../../../engine/math-lib';
import type { Point } from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';

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

export const projectSegment = (
  point1: Point,
  point2: Point,
  axis: Vector2,
): Projection => {
  const projection1 = VectorOps.dotProduct(point1, axis);
  const projection2 = VectorOps.dotProduct(point2, axis);

  return {
    min: Math.min(projection1, projection2),
    max: Math.max(projection1, projection2),
  };
};

export const getProjectionOverlap = (
  min1: number,
  max1: number,
  min2: number,
  max2: number,
): number | false => {
  const distance1 = min1 - max2;
  const distance2 = min2 - max1;

  if (distance1 > INTERSECTION_EPSILON || distance2 > INTERSECTION_EPSILON) {
    return false;
  }

  return Math.min(Math.abs(distance1), Math.abs(distance2));
};
