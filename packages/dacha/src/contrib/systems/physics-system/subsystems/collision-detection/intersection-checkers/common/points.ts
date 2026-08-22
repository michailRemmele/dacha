import type { Vector2 } from '../../../../../../../engine/math-lib';
import type { Point } from '../../types';
import { isZero } from '../../utils';

export const arePointsEqual = (point1: Point, point2: Point): boolean =>
  isZero(point1.x - point2.x) && isZero(point1.y - point2.y);

export const lerpPoint = (
  point1: Point,
  point2: Point,
  value: number,
): Point => ({
  x: point1.x + (point2.x - point1.x) * value,
  y: point1.y + (point2.y - point1.y) * value,
});

export const getDistanceSquared = (point1: Point, point2: Point): number =>
  (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2;

export const sortPoints = (points: Point[], normal: Vector2): Point[] => {
  if (points.length !== 2) {
    return points;
  }

  const tangentX = -normal.y;
  const tangentY = normal.x;
  const projection1 = points[0].x * tangentX + points[0].y * tangentY;
  const projection2 = points[1].x * tangentX + points[1].y * tangentY;

  if (projection1 <= projection2) {
    return points;
  }

  const point = points[0];

  points[0] = points[1];
  points[1] = point;

  return points;
};
