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
}
