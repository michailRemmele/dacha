import {
  MathOps,
  Vector2,
  VectorOps,
} from '../../../../../../../engine/math-lib';
import type {
  CircleGeometry,
  Proxy,
  SegmentGeometry,
  Intersection,
} from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';
import { orientNormal } from '../common/normals';

/**
 * Checks a circle against a segment.
 *
 * The circle center is projected onto the finite segment. When the distance
 * from that closest point to the center is within the circle radius, the
 * projected point becomes the contact point and the normal points away from
 * the segment toward the circle center.
 */
export const checkCircleAndSegmentIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const circle = arg1.geometry as CircleGeometry;
  const segment = arg2.geometry as SegmentGeometry;
  const closestPoint = VectorOps.getClosestPointOnEdge(circle.center, segment);
  const distance = MathOps.getDistanceBetweenTwoPoints(
    circle.center.x,
    closestPoint.x,
    circle.center.y,
    closestPoint.y,
  );

  if (distance > circle.radius + INTERSECTION_EPSILON) {
    return false;
  }

  const normal = new Vector2(
    circle.center.x - closestPoint.x,
    circle.center.y - closestPoint.y,
  );

  if (normal.magnitude === 0) {
    normal.x = segment.normal.x;
    normal.y = segment.normal.y;
  } else {
    normal.normalize();
  }

  return {
    normal: orientNormal(normal, circle.center, segment.center),
    penetration: Math.max(0, circle.radius - distance),
    contactPoints: [closestPoint],
  };
};
