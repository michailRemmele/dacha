import type { Point } from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';

export const arePointsEqual = (point1: Point, point2: Point): boolean =>
  Math.abs(point1.x - point2.x) <= INTERSECTION_EPSILON &&
  Math.abs(point1.y - point2.y) <= INTERSECTION_EPSILON;

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
