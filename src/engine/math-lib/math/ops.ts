interface Point {
  x: number
  y: number
}

export class MathOps {
  /*
   * Generate random number in [min, max] range
   */
  static random(min: number, max: number): number {
    return Math.floor(min + (Math.random() * (max + 1 - min)));
  }

  /*
   * Convert radians to degrees
   */
  static radToDeg(rad: number): number {
    const angleInDegrees = (rad * 180) / Math.PI;
    return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
  }

  /*
   * Convert degrees to radians
   */
  static degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  /*
   * Calculate angle between two point in radians
   */
  static getAngleBetweenTwoPoints(x1: number, x2: number, y1: number, y2: number): number {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  /*
   * Calculate distance between two point
   */
  static getDistanceBetweenTwoPoints(x1: number, x2: number, y1: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /*
   * Calculate point on line
   */
  static getLinePoint(angle: number, x: number, y: number, length: number): Point {
    const angleInRad = this.degToRad(angle);

    return {
      x: x - (length * Math.cos(angleInRad)),
      y: y - (length * Math.sin(angleInRad)),
    };
  }

  static clamp(value: number, min: number, max: number): number {
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }
}
