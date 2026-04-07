/**
 * A 2D vector with x and y coordinates.
 *
 * @category Core
 */
export class Vector2 {
  /** X coordinate of the vector */
  x: number;
  /** Y coordinate of the vector */
  y: number;

  /**
   * Creates a new vector with the given x and y coordinates.
   * @param x - X coordinate of the vector
   * @param y - Y coordinate of the vector
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns the Euclidean length of the vector.
   *
   * @returns Magnitude of the vector
   */
  get magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Adds another vector to the current vector in place.
   *
   * @param vector - Vector to add
   * @returns The current vector after the addition
   */
  add(vector: Vector2): Vector2 {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  /**
   * Multiplies the current vector by a scalar in place.
   *
   * @param number - Number to multiply by
   * @returns The current vector after scaling
   */
  multiplyNumber(number: number): Vector2 {
    this.x *= number;
    this.y *= number;

    return this;
  }

  /**
   * Normalizes the current vector to unit length in place.
   *
   * If the vector magnitude is zero, it remains unchanged.
   *
   * @returns The current vector after normalization
   */
  normalize(): Vector2 {
    const magnitude = this.magnitude;

    if (magnitude === 0) {
      return this;
    }

    this.multiplyNumber(1 / magnitude);

    return this;
  }

  /**
   * Checks whether another vector has the same coordinates.
   *
   * @param vector - Vector to compare with
   * @returns True if the vectors are equal, false otherwise
   */
  equals(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  /**
   * Creates a new vector with the same coordinates.
   *
   * @returns A new vector with the same x and y coordinates
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
