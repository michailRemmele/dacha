import {
  MathOps,
  VectorOps,
  type Vector2,
} from '../../../../../../../engine/math-lib';
import type { BoxGeometry, Point, SegmentGeometry } from '../../types';
import { INTERSECTION_EPSILON, projectPolygon } from '../utils';

const arePointsEqual = (point1: Point, point2: Point): boolean =>
  Math.abs(point1.x - point2.x) <= INTERSECTION_EPSILON &&
  Math.abs(point1.y - point2.y) <= INTERSECTION_EPSILON;

export const lerpPoint = (
  point1: Point,
  point2: Point,
  value: number,
): Point => ({
  x: point1.x + (point2.x - point1.x) * value,
  y: point1.y + (point2.y - point1.y) * value,
});

export const findMinBoxSegmentOverlap = (
  box: BoxGeometry,
  segment: SegmentGeometry,
): { axis: Vector2; overlap: number } | false => {
  const axes = [...box.edges.map((edge) => edge.normal), segment.normal];
  let minOverlap = Infinity;
  let bestAxis = axes[0];

  for (const axis of axes) {
    const boxProjection = projectPolygon(box.points, axis);
    const segmentProjection = projectPolygon(
      [segment.point1, segment.point2],
      axis,
    );
    const distance1 = segmentProjection.min - boxProjection.max;
    const distance2 = boxProjection.min - segmentProjection.max;

    if (distance1 > INTERSECTION_EPSILON || distance2 > INTERSECTION_EPSILON) {
      return false;
    }

    const overlap = Math.min(Math.abs(distance1), Math.abs(distance2));

    if (overlap < minOverlap) {
      minOverlap = overlap;
      bestAxis = axis;
    }
  }

  return {
    axis: bestAxis,
    overlap: minOverlap,
  };
};

/**
 * Clips the segment against each box edge's inward half-space.
 *
 * The segment is treated parametrically, with `t = 0` at `point1` and
 * `t = 1` at `point2`. Each box edge can only shrink that valid `[start, end]`
 * interval. After all four edges are processed, the surviving interval is:
 * - empty: no intersection
 * - a single `t`: one touching point
 * - a finite interval: the overlapping subsegment inside the box
 *
 */
export const buildBoxSegmentContactPoints = (
  box: BoxGeometry,
  segment: SegmentGeometry,
): Point[] => {
  let start = 0;
  let end = 1;

  for (const edge of box.edges) {
    const offset = VectorOps.dotProduct(edge.point1, edge.normal);
    const point1Distance =
      VectorOps.dotProduct(segment.point1, edge.normal) - offset;
    const point2Distance =
      VectorOps.dotProduct(segment.point2, edge.normal) - offset;

    if (
      point1Distance > INTERSECTION_EPSILON &&
      point2Distance > INTERSECTION_EPSILON
    ) {
      return [];
    }

    if (
      point1Distance <= INTERSECTION_EPSILON &&
      point2Distance <= INTERSECTION_EPSILON
    ) {
      continue;
    }

    const denominator = point1Distance - point2Distance;
    const t = denominator === 0 ? 0 : point1Distance / denominator;

    if (point1Distance > INTERSECTION_EPSILON) {
      start = Math.max(start, t);
    } else {
      end = Math.min(end, t);
    }

    if (start > end + INTERSECTION_EPSILON) {
      return [];
    }
  }

  const contact1 = lerpPoint(
    segment.point1,
    segment.point2,
    MathOps.clamp(start, 0, 1),
  );

  if (Math.abs(end - start) <= INTERSECTION_EPSILON) {
    return [contact1];
  }

  const contact2 = lerpPoint(
    segment.point1,
    segment.point2,
    MathOps.clamp(end, 0, 1),
  );

  return arePointsEqual(contact1, contact2) ? [contact1] : [contact1, contact2];
};
