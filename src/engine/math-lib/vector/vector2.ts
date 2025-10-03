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
   * Calculates the magnitude of the vector.
   * @returns Magnitude of the vector
   */
  get magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Adds the given vector to the current vector.
   * @param vector - Vector to add
   */
  add(vector: Vector2): void {
    this.x += vector.x;
    this.y += vector.y;
  }

  /**
   * Multiplies the current vector by the given number.
   * @param number - Number to multiply by
   */
  multiplyNumber(number: number): void {
    this.x *= number;
    this.y *= number;
  }

  /**
   * Checks if the current vector is equal to the given vector.
   * @param vector - Vector to compare with
   * @returns True if the vectors are equal, false otherwise
   */
  equals(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  /**
   * Creates a new vector with the same x and y coordinates as the current vector.
   * @returns A new vector with the same x and y coordinates
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
