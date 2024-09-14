import { Vector2 } from './vector2';

type Point = {
  x: number
  y: number
};

export class VectorOps {
  static fixCalcError(value: number): number {
    return Math.abs(value) < Number.EPSILON ? 0 : value;
  }

  /*
   * Calculate vector by angle in radians
   */
  static getVectorByAngle(angle: number): Vector2 {
    const x = this.fixCalcError(Math.cos(angle));
    const y = this.fixCalcError(Math.sin(angle));

    return new Vector2(x, y);
  }

  /*
   * Calculate normal by line segment
   */
  static getNormal(x1: number, x2: number, y1: number, y2: number): Vector2 {
    const normal = new Vector2(y1 - y2, x2 - x1);
    normal.multiplyNumber(1 / normal.magnitude);

    return normal;
  }

  /*
   * Calculate dot product of two vectors
   */
  static dotProduct(point: Point, vector: Vector2): number {
    return (point.x * vector.x) + (point.y * vector.y);
  }
}
