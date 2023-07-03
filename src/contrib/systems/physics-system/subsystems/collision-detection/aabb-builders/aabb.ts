import type { Point } from '../types';

export class AABB {
  min: Point;
  max: Point;

  constructor(min: Point, max: Point) {
    this.min = min;
    this.max = max;
  }
}
