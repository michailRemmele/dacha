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
