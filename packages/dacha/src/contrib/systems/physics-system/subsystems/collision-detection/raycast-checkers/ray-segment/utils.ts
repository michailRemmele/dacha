import type { Point } from '../../types';

export const subtractPoints = (point1: Point, point2: Point): Point => ({
  x: point1.x - point2.x,
  y: point1.y - point2.y,
});
