import { Vector2 } from './vector2';

export class VectorOps {
  static fixCalcError(value) {
    return Math.abs(value) < Number.EPSILON ? 0 : value;
  }

  /*
   * Calculate vector by angle in radians
   */
  static getVectorByAngle(angle) {
    const x = this.fixCalcError(Math.cos(angle));
    const y = this.fixCalcError(Math.sin(angle));

    return new Vector2(x, y);
  }

  /*
   * Calculate normal by line segment
   */
  static getNormal(x1, x2, y1, y2) {
    const normal = new Vector2(y1 - y2, x2 - x1);
    normal.multiplyNumber(1 / normal.magnitude);

    return normal;
  }

  /*
   * Calculate dot product of two vectors
   */
  static dotProduct(point, vector) {
    return (point.x * vector.x) + (point.y * vector.y);
  }
}
