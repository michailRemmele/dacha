import { Vector2 } from './vector2';

interface Point {
  x: number;
  y: number;
}

interface Edge {
  point1: Point;
  point2: Point;
}

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
    return point.x * vector.x + point.y * vector.y;
  }

  /**
   * Projects a point onto a given edge, returning the closest point
   *
   * @param {Point} point - The point to project. Should have properties `x` and `y`.
   * @param {Edge} edge - The edge to project onto, defined by two endpoints `point1` and `point2`.
   *                      Each endpoint should have properties `x` and `y`.
   * @returns {Point} The projected point on the edge, with `x` and `y` coordinates.
   */
  static projectPointToEdge(point: Point, edge: Edge): Point {
    const abVector = new Vector2(
      edge.point2.x - edge.point1.x,
      edge.point2.y - edge.point1.y,
    );
    const apVector = new Vector2(
      point.x - edge.point1.x,
      point.y - edge.point1.y,
    );

    const dotProduct = VectorOps.dotProduct(apVector, abVector);
    const lengthSquared = abVector.x * abVector.x + abVector.y * abVector.y;

    const t = dotProduct / lengthSquared;

    return {
      x: edge.point1.x + t * abVector.x,
      y: edge.point1.y + t * abVector.y,
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
