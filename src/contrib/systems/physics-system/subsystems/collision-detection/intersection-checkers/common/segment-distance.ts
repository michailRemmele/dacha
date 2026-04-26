import { MathOps, VectorOps } from '../../../../../../../engine/math-lib';
import type { Edge, Point } from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';

import { getDistanceSquared } from './points';

const getPointOnSegment = (segment: Edge, value: number): Point => ({
  x: segment.point1.x + (segment.point2.x - segment.point1.x) * value,
  y: segment.point1.y + (segment.point2.y - segment.point1.y) * value,
});

const getSegmentIntersectionPoint = (
  segment1: Edge,
  segment2: Edge,
): Point | null => {
  const direction1X = segment1.point2.x - segment1.point1.x;
  const direction1Y = segment1.point2.y - segment1.point1.y;
  const direction2X = segment2.point2.x - segment2.point1.x;
  const direction2Y = segment2.point2.y - segment2.point1.y;
  const deltaX = segment2.point1.x - segment1.point1.x;
  const deltaY = segment2.point1.y - segment1.point1.y;
  const denominator = direction1X * direction2Y - direction1Y * direction2X;

  if (Math.abs(denominator) <= INTERSECTION_EPSILON) {
    return null;
  }

  const t = (deltaX * direction2Y - deltaY * direction2X) / denominator;
  const u = (deltaX * direction1Y - deltaY * direction1X) / denominator;

  if (
    t < -INTERSECTION_EPSILON ||
    t > 1 + INTERSECTION_EPSILON ||
    u < -INTERSECTION_EPSILON ||
    u > 1 + INTERSECTION_EPSILON
  ) {
    return null;
  }

  return getPointOnSegment(segment1, MathOps.clamp(t, 0, 1));
};

interface ClosestPoints {
  point1: Point;
  point2: Point;
  distance: number;
}

const chooseCloserPoints = (
  current: ClosestPoints,
  point1: Point,
  point2: Point,
  minDistanceSquared: number,
): number => {
  const distanceSquared = getDistanceSquared(point1, point2);

  if (distanceSquared < minDistanceSquared) {
    current.point1 = point1;
    current.point2 = point2;

    return distanceSquared;
  }

  return minDistanceSquared;
};

/**
 * Finds the closest pair of points between two finite segments.
 *
 * Intersecting segments are handled first so crossing capsules/segments get a
 * zero-distance contact instead of an arbitrary endpoint pair. For disjoint
 * segments, the minimum must involve at least one endpoint, so the function
 * checks each endpoint projected onto the opposite segment and keeps the
 * shortest candidate.
 */
export const getClosestPointsBetweenSegments = (
  segment1: Edge,
  segment2: Edge,
): ClosestPoints => {
  const intersection = getSegmentIntersectionPoint(segment1, segment2);

  if (intersection) {
    return { point1: intersection, point2: intersection, distance: 0 };
  }

  const closest: ClosestPoints = {
    point1: segment1.point1,
    point2: VectorOps.getClosestPointOnEdge(segment1.point1, segment2),
    distance: 0,
  };
  let minDistanceSquared = getDistanceSquared(closest.point1, closest.point2);

  minDistanceSquared = chooseCloserPoints(
    closest,
    segment1.point2,
    VectorOps.getClosestPointOnEdge(segment1.point2, segment2),
    minDistanceSquared,
  );
  minDistanceSquared = chooseCloserPoints(
    closest,
    VectorOps.getClosestPointOnEdge(segment2.point1, segment1),
    segment2.point1,
    minDistanceSquared,
  );
  minDistanceSquared = chooseCloserPoints(
    closest,
    VectorOps.getClosestPointOnEdge(segment2.point2, segment1),
    segment2.point2,
    minDistanceSquared,
  );

  closest.distance = Math.sqrt(minDistanceSquared);

  return closest;
};
