/**
 * A point in 2D space with x and y coordinates.
 */
interface Point {
  /** X coordinate of the point */
  x: number
  /** Y coordinate of the point */
  y: number
}

/**
 * Utility class providing static methods for mathematical operations.
 * 
 * This class contains mathematical operations for working with 2D points and vectors.
 * All methods are static and can be used without instantiating the class.
 * 
 * @example
 * ```typescript
 * const point = { x: 3, y: 4 };
 * const distance = MathOps.getDistanceBetweenTwoPoints(point, point);
 * ```
 * 
 * @category Core
 */
export class MathOps {
  /**
   * Generate random number in [min, max] range
   * 
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns A random number in [min, max] range
   *
   * @example
   * ```typescript
   * const random = MathOps.random(0, 10);
   * ```
   */
  static random(min: number, max: number): number {
    return Math.floor(min + (Math.random() * (max + 1 - min)));
  }

  /**
   * Convert radians to degrees
   * 
   * @param rad - Angle in radians
   * @returns Angle in degrees
   *
   * @example
   * ```typescript
   * const angle = MathOps.radToDeg(Math.PI / 2);
   * ```
   */
  static radToDeg(rad: number): number {
    const angleInDegrees = (rad * 180) / Math.PI;
    return angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;
  }

  /**
   * Convert degrees to radians
   * 
   * @param deg - Angle in degrees
   * @returns Angle in radians
   *
   * @example
   * ```typescript
   * const angle = MathOps.degToRad(90);
   * ```
   */
  static degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  /**
   * Calculate angle between two point in radians
   * 
   * @param x1 - X coordinate of the first point
   * @param x2 - X coordinate of the second point
   * @param y1 - Y coordinate of the first point
   * @param y2 - Y coordinate of the second point
   * @returns Angle in radians
   *
   * @example
   * ```typescript
   * const angle = MathOps.getAngleBetweenTwoPoints(10, 20, 30, 40);
   * ```
   */
  static getAngleBetweenTwoPoints(x1: number, x2: number, y1: number, y2: number): number {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  /**
   * Calculate distance between two point
   * 
   * @param x1 - X coordinate of the first point
   * @param x2 - X coordinate of the second point
   * @param y1 - Y coordinate of the first point
   * @param y2 - Y coordinate of the second point
   * @returns Distance between the two points
   *
   * @example
   * ```typescript
   * const distance = MathOps.getDistanceBetweenTwoPoints(10, 20, 30, 40);
   * ```
   */
  static getDistanceBetweenTwoPoints(x1: number, x2: number, y1: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * Calculate point on line
   * 
   * @param angle - Angle of the line in degrees
   * @param x - X coordinate of the line start point
   * @param y - Y coordinate of the line start point
   * @param length - Distance from the start point to the point on the line
   * @returns Point on the line
   *
   * @example
   * ```typescript
   * const point = MathOps.getLinePoint(45, 10, 20, 10);
   * ```
   */
  static getLinePoint(angle: number, x: number, y: number, length: number): Point {
    const angleInRad = this.degToRad(angle);

    return {
      x: x - (length * Math.cos(angleInRad)),
      y: y - (length * Math.sin(angleInRad)),
    };
  }

  /**
   * Clamp a value between a minimum and maximum value
   * 
   * @param value - Value to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Clamped value
   *
   * @example
   * ```typescript
   * const clamped = MathOps.clamp(10, 0, 5); // returns 5
   * ```
   */
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
