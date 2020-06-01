export class MathOps {
  /*
   * Generate random number in [min, max] range
   */
  static random(min, max) {
    return Math.floor(min + (Math.random() * (max + 1 - min)));
  }

  /*
   * Convert radians to degrees
   */
  static radToDeg(rad) {
    const angleInDegrees = rad * 180 / Math.PI;
    return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
  }

  /*
   * Convert degrees to radians
   */
  static degToRad(deg) {
    return deg * Math.PI / 180;
  }

  /*
   * Calculate angle between two point in radians
   */
  static getAngleBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  /*
   * Calculate distance between two point
   */
  static getDistanceBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  /*
   * Calculate point on line
   */
  static getLinePoint(angle, x, y, length) {
    const angleInRad = this.degToRad(angle);

    return {
      x: x - (length * Math.cos(angleInRad)),
      y: y - (length * Math.sin(angleInRad)),
    };
  }
}
