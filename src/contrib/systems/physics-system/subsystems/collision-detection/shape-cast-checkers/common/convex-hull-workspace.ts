import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import type { BoxGeometry, EdgeWithNormal, Point } from '../../types';
import { isDefinitelyPositive, isZero } from '../../utils';
import {
  getCrossProduct,
  getSquaredDistance,
  isSamePoint,
  setNormal,
} from './geometry';
import { BOX_CORNER_SIGNS } from './constants';

/**
 * Reusable temporary workspace for shape-cast convex hull geometry.
 *
 * Shape casts sometimes need to test a moving shape against a derived convex
 * polygon, for example a box expanded around the two endpoints of a segment.
 * Allocating fresh arrays, points, edges, and normals for every cast is costly
 * in the narrow phase. This workspace owns those temporary objects once and
 * mutates them for each query.
 *
 * Usage pattern:
 * 1. Call `start()`.
 * 2. Add source points with `addExpandedPoint(...)`.
 * 3. Immediately pass `buildGeometry()` to the ray or shape checker.
 *
 * Returned geometry and edges are mutable views into this workspace. They are
 * valid only until the workspace is cleared or reused. Keep workspace instances
 * local to one checker path and do not cache returned geometry across casts.
 */
export class ConvexHullWorkspace {
  private readonly points: Point[];
  private readonly hullPoints: Point[] = [];
  private readonly edges: EdgeWithNormal[];
  private readonly activeEdges: EdgeWithNormal[] = [];
  private readonly geometry: BoxGeometry = {
    center: { x: 0, y: 0 },
    points: this.hullPoints,
    edges: this.activeEdges,
  };
  private pointCount = 0;

  /**
   * Creates a fixed-capacity workspace.
   *
   * `maxPoints` is the maximum number of raw points that can be added before
   * the convex hull is built. Choose the smallest value that covers the checker:
   * expanding two points by box half-extents needs 8 points, while expanding up
   * to four box points needs 16.
   */
  constructor(maxPoints: number) {
    this.points = Array.from({ length: maxPoints }, () => ({ x: 0, y: 0 }));
    this.edges = Array.from({ length: maxPoints }, () => ({
      point1: { x: 0, y: 0 },
      point2: { x: 0, y: 0 },
      normal: new Vector2(0, 0),
    }));
  }

  /**
   * Starts a new temporary geometry build.
   *
   * This does not clear arrays or allocate new objects; it only resets the raw
   * point count so the existing point, hull, edge, and geometry objects can be
   * overwritten by the next build.
   */
  start(): void {
    this.pointCount = 0;
  }

  /**
   * Adds the four corners of an axis-aligned box centered on `point`.
   *
   * This is used for Minkowski-style expansion of a target point by a moving
   * box's half-extents: casting the box against the point becomes casting the
   * box center ray against the expanded convex target.
   */
  addExpandedPoint(point: Point, halfExtents: Point): void {
    for (const [signX, signY] of BOX_CORNER_SIGNS) {
      this.addPointCoordinates(
        point.x + halfExtents.x * signX,
        point.y + halfExtents.y * signY,
      );
    }
  }

  /**
   * Builds a convex `BoxGeometry` view from the currently added raw points.
   *
   * The method removes duplicate points, computes the convex hull, calculates
   * the hull center, and prepares outward-facing edge normals. The returned
   * object is reused by this workspace; consume it immediately and do not store
   * it after the next `clear()` or add/build cycle.
   */
  buildGeometry(): BoxGeometry {
    const uniquePointsCount = this.compactUniquePoints();
    const convexPoints = this.buildConvexHull(uniquePointsCount);

    this.geometry.center.x = 0;
    this.geometry.center.y = 0;
    this.activeEdges.length = convexPoints.length;

    if (convexPoints.length === 0) {
      return this.geometry;
    }

    for (const point of convexPoints) {
      this.geometry.center.x += point.x;
      this.geometry.center.y += point.y;
    }

    this.geometry.center.x /= convexPoints.length;
    this.geometry.center.y /= convexPoints.length;

    for (let index = 0; index < convexPoints.length; index += 1) {
      const edge = this.edges[index];
      const point1 = convexPoints[index];
      const point2 = convexPoints[(index + 1) % convexPoints.length];

      edge.point1 = point1;
      edge.point2 = point2;
      setNormal(edge.normal, point1, point2);

      const offset = VectorOps.dotProduct(point1, edge.normal);

      if (
        VectorOps.dotProduct(this.geometry.center, edge.normal) - offset >
        0
      ) {
        edge.normal.multiplyNumber(-1);
      }

      this.activeEdges[index] = edge;
    }

    return this.geometry;
  }

  /**
   * Writes one raw point into the fixed point buffer.
   *
   * Throws when a checker adds more points than the capacity declared in the
   * constructor. That is preferable to silently corrupting the temporary hull.
   */
  private addPointCoordinates(x: number, y: number): void {
    if (this.pointCount >= this.points.length) {
      throw new RangeError('Convex hull workspace point capacity exceeded.');
    }

    const point = this.points[this.pointCount];

    point.x = x;
    point.y = y;
    this.pointCount += 1;
  }

  /**
   * Finds the left-most, then top-most, point used as the hull walk start.
   *
   * The hull builder uses a gift-wrapping walk. A stable extremal start point
   * avoids depending on the order in which caller code added raw points.
   */
  private findStartPointIndex(pointsCount: number): number {
    let startIndex = 0;

    for (let index = 1; index < pointsCount; index += 1) {
      const point = this.points[index];
      const startPoint = this.points[startIndex];

      if (
        point.x < startPoint.x ||
        (isZero(point.x - startPoint.x) && point.y < startPoint.y)
      ) {
        startIndex = index;
      }
    }

    return startIndex;
  }

  /**
   * Removes duplicate raw points in-place and returns the remaining count.
   *
   * Expansion can create duplicates, for example when a capsule segment has
   * zero length or when several corners collapse under small extents. Duplicate
   * removal keeps the hull walk from selecting the same coordinate repeatedly.
   */
  private compactUniquePoints(): number {
    let pointsCount = this.pointCount;

    for (let index = 0; index < pointsCount; index += 1) {
      for (let nextIndex = index + 1; nextIndex < pointsCount; nextIndex += 1) {
        if (!isSamePoint(this.points[index], this.points[nextIndex])) {
          continue;
        }

        pointsCount -= 1;
        this.points[nextIndex].x = this.points[pointsCount].x;
        this.points[nextIndex].y = this.points[pointsCount].y;
        nextIndex -= 1;
      }
    }

    this.pointCount = pointsCount;

    return pointsCount;
  }

  /**
   * Computes the convex hull of the compacted raw points.
   *
   * The implementation uses a small-N gift-wrapping algorithm because these
   * temporary shapes are tiny and fixed-size. For collinear candidates it keeps
   * the farthest point, so intermediate points on the same side do not become
   * extra hull vertices.
   */
  private buildConvexHull(pointsCount: number): Point[] {
    this.hullPoints.length = 0;

    if (pointsCount === 0) {
      return this.hullPoints;
    }

    const startPointIndex = this.findStartPointIndex(pointsCount);
    let currentIndex = startPointIndex;

    do {
      const currentPoint = this.points[currentIndex];
      let nextIndex = currentIndex === 0 ? 1 : 0;

      for (let index = 0; index < pointsCount; index += 1) {
        if (index === currentIndex) {
          continue;
        }

        const nextPoint = this.points[nextIndex];
        const candidatePoint = this.points[index];
        const crossProduct = getCrossProduct(
          currentPoint,
          nextPoint,
          candidatePoint,
        );

        if (
          isDefinitelyPositive(crossProduct) ||
          (isZero(crossProduct) &&
            getSquaredDistance(currentPoint, candidatePoint) >
              getSquaredDistance(currentPoint, nextPoint))
        ) {
          nextIndex = index;
        }
      }

      this.hullPoints.push(currentPoint);
      currentIndex = nextIndex;
    } while (
      currentIndex !== startPointIndex &&
      this.hullPoints.length < pointsCount
    );

    return this.hullPoints;
  }
}
