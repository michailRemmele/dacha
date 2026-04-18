import {
  MathOps,
  Vector2,
  VectorOps,
} from '../../../../../../../engine/math-lib';
import type {
  PointGeometry,
  Proxy,
  SegmentGeometry,
  Intersection,
} from '../../types';
import { orientNormal, INTERSECTION_EPSILON } from '../utils';

/**
 * Checks whether a query point lies on a segment.
 *
 * The closest point on the finite segment is projected from the point.
 * If the projected distance is near zero, that projected point becomes
 * the contact point and the stored segment normal is used for orientation.
 */
export const checkPointAndSegmentIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const isSegmentFirst = 'point1' in arg1.geometry;
  const segment = (
    isSegmentFirst ? arg1.geometry : arg2.geometry
  ) as SegmentGeometry;
  const point = (
    isSegmentFirst ? arg2.geometry : arg1.geometry
  ) as PointGeometry;
  const closestPoint = VectorOps.getClosestPointOnEdge(point.center, segment);
  const distance = MathOps.getDistanceBetweenTwoPoints(
    point.center.x,
    closestPoint.x,
    point.center.y,
    closestPoint.y,
  );

  if (distance > INTERSECTION_EPSILON) {
    return false;
  }

  return {
    normal: orientNormal(
      segment.normal.magnitude === 0
        ? new Vector2(1, 0)
        : segment.normal.clone(),
      (arg1.geometry as PointGeometry | SegmentGeometry).center,
      (arg2.geometry as PointGeometry | SegmentGeometry).center,
    ),
    penetration: 0,
    contactPoints: [closestPoint],
  };
};
