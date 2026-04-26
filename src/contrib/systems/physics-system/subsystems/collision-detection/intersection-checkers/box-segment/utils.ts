import {
  MathOps,
  VectorOps,
  type Vector2,
} from '../../../../../../../engine/math-lib';
import type { BoxGeometry, Point, SegmentGeometry } from '../../types';
import { arePointsEqual, lerpPoint } from '../common/points';
import { INTERSECTION_EPSILON } from '../../constants';
import {
  getProjectionOverlap,
  projectPolygon,
  projectSegment,
} from '../common/projections';

const getBoxSegmentAxisOverlap = (
  box: BoxGeometry,
  segment: SegmentGeometry,
  axis: Vector2,
): number | false => {
  const boxProjection = projectPolygon(box.points, axis);
  const segmentProjection = projectSegment(
    segment.point1,
    segment.point2,
    axis,
  );

  return getProjectionOverlap(
    segmentProjection.min,
    segmentProjection.max,
    boxProjection.min,
    boxProjection.max,
  );
};

export const findMinBoxSegmentOverlap = (
  box: BoxGeometry,
  segment: SegmentGeometry,
): { axis: Vector2; overlap: number } | false => {
  let minOverlap = Infinity;
  let bestAxis = box.edges[0].normal;

  for (let i = 0; i < 2; i += 1) {
    const edge = box.edges[i];
    const overlap = getBoxSegmentAxisOverlap(box, segment, edge.normal);

    if (overlap === false) {
      return false;
    }

    if (overlap < minOverlap) {
      minOverlap = overlap;
      bestAxis = edge.normal;
    }
  }

  const segmentAxisOverlap = getBoxSegmentAxisOverlap(
    box,
    segment,
    segment.normal,
  );

  if (segmentAxisOverlap === false) {
    return false;
  }

  if (segmentAxisOverlap < minOverlap) {
    minOverlap = segmentAxisOverlap;
    bestAxis = segment.normal;
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
