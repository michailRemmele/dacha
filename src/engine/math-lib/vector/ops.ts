import { Vector2 } from './vector2';

/**
 * A point in 2D space with x and y coordinates.
 */
interface Point {
  x: number;
  y: number;
}

/**
 * An edge defined by two points in 2D space.
 */
interface Edge {
  point1: Point;
  point2: Point;
}

/**
 * Utility class providing static methods for vector operations and geometric calculations.
 *
 * This class contains mathematical operations for working with 2D vectors, points, and
 * geometric shapes. All methods are static and can be used without instantiating the class.
 *
 * @example
 * ```typescript
 * // Create a vector from an angle
 * const direction = VectorOps.getVectorByAngle(Math.PI / 4); // 45 degrees
 *
 * // Calculate dot product
 * const dot = VectorOps.dotProduct(point, direction);
 *
 * // Project a point onto an edge
 * const projected = VectorOps.projectPointToEdge(point, edge);
 *
 * // Check if point is inside polygon
 * const inside = VectorOps.isPointInPolygon(point, polygonEdges);
 * ```
 *
 * @category Core
 */
export class VectorOps {
  /**
   * Fixes floating-point calculation errors by converting very small numbers to zero.
   *
   * @param value - Number to fix
   * @returns Fixed number (0 if smaller than epsilon, otherwise unchanged)
   */
  static fixCalcError(value: number): number {
    return Math.abs(value) < Number.EPSILON ? 0 : value;
  }

  /**
   * Creates a unit vector from an angle in radians.
   *
   * @param angle - Angle in radians
   * @returns A normalized Vector2 pointing in the direction of the angle
   *
   * @example
   * ```typescript
   * // Create a vector pointing down
   * const angle = VectorOps.getVectorByAngle(Math.PI / 2);
   * ```
   */
  static getVectorByAngle(angle: number): Vector2 {
    const x = this.fixCalcError(Math.cos(angle));
    const y = this.fixCalcError(Math.sin(angle));

    return new Vector2(x, y);
  }

  /**
   * Calculates the normal vector of a line segment.
   *
   * @param x1 - X coordinate of the first point
   * @param x2 - X coordinate of the second point
   * @param y1 - Y coordinate of the first point
   * @param y2 - Y coordinate of the second point
   * @returns A normalized Vector2 representing the line's normal
   *
   * @example
   * ```typescript
   * // Get normal of a horizontal line
   * const normal = VectorOps.getNormal(0, 10, 0, 0);
   * ```
   */
  static getNormal(x1: number, x2: number, y1: number, y2: number): Vector2 {
    if (x1 === x2 && y1 === y2) {
      return VectorOps.getVectorByAngle(0);
    }

    const normal = new Vector2(y1 - y2, x2 - x1);
    normal.multiplyNumber(1 / normal.magnitude);

    return normal;
  }

  /**
   * Calculates the dot product of a point and a vector.
   *
   * @param point - Point to use in the dot product
   * @param vector - Vector to use in the dot product
   * @returns Dot product result
   *
   * @example
   * ```typescript
   * const point = { x: 3, y: 4 };
   * const vector = new Vector2(1, 2);
   * const dot = VectorOps.dotProduct(point, vector);
   * ```
   */
  static dotProduct(point: Point, vector: Vector2): number {
    return point.x * vector.x + point.y * vector.y;
  }

  /**
   * Calculates the cross product of two points.
   *
   * @param point1 - First point to use in the cross product
   * @param point2 - Second point to use in the cross product
   * @returns Scalar value representing the cross product of the two points
   *
   * @example
   * ```typescript
   * const point1 = { x: 3, y: 4 };
   * const point2 = { x: 1, y: 2 };
   * const cross = VectorOps.crossProduct(point1, point2);
   * ```
   */
  static crossProduct(point1: Point, point2: Point): number {
    return point1.x * point2.y - point1.y * point2.x;
  }

  /**
   * Returns the closest point on an edge segment to the given point.
   *
   * @param {Point} point - Point to project. Should have properties `x` and `y`.
   * @param {Edge} edge - Edge to project onto, defined by two endpoints `point1` and `point2`.
   *                      Each endpoint should have properties `x` and `y`.
   * @returns {Point} Projected point on the edge, with `x` and `y` coordinates.
   *
   * @example
   * ```typescript
   * const point = { x: 3, y: 4 };
   * const edge = { point1: { x: 0, y: 0 }, point2: { x: 10, y: 0 } };
   * const projected = VectorOps.getClosestPointOnEdge(point, edge);
   * ```
   */
  static getClosestPointOnEdge(point: Point, edge: Edge): Point {
    const abX = edge.point2.x - edge.point1.x;
    const abY = edge.point2.y - edge.point1.y;
    const apX = point.x - edge.point1.x;
    const apY = point.y - edge.point1.y;

    const lengthSquared = abX * abX + abY * abY;

    if (lengthSquared === 0) {
      return edge.point1;
    }

    const dotProduct = apX * abX + apY * abY;

    const t = Math.max(0, Math.min(1, dotProduct / lengthSquared));

    return {
      x: edge.point1.x + t * abX,
      y: edge.point1.y + t * abY,
    };
  }

  /**
   * Determines if a point is inside a polygon.
   *
   * @param {Point} point - The point to test. Should have properties `x` and `y`.
   * @param {Edge[]} polygon - An array of edges representing the polygon.
   *                           Each edge is defined by two endpoints `point1` and `point2`,
   *                           where each endpoint has properties `x` and `y`.
   * @returns {boolean} Returns `true` if the point is inside the polygon, otherwise `false`.
   *
   * @note The algorithm may be inaccurate in edge cases,
   *       such as when the point lies exactly on a polygon corner.
   *
   * @example
   * ```typescript
   * const point = { x: 5, y: 5 };
   * const polygon = [
   *   { point1: { x: 2, y: 12 }, point2: { x: 12, y: 12 } },
   *   { point1: { x: 12, y: 12 }, point2: { x: 12, y: 2 } },
   *   { point1: { x: 12, y: 2 }, point2: { x: 2, y: 2 } },
   *   { point1: { x: 2, y: 2 }, point2: { x: 2, y: 12 } },
   * ];
   * const isInside = VectorOps.isPointInPolygon(point, polygon);
   * ```
   */
  static isPointInPolygon = (point: Point, polygon: Edge[]): boolean => {
    const { x, y } = point;

    let isInside = false;
    for (const edge of polygon) {
      const x1 = edge.point1.x;
      const y1 = edge.point1.y;

      const x2 = edge.point2.x;
      const y2 = edge.point2.y;

      // https://en.wikipedia.org/wiki/Linear_equation#Determinant_form
      const isIntersection =
        y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
      if (isIntersection) {
        isInside = !isInside;
      }
    }

    return isInside;
  };
}
