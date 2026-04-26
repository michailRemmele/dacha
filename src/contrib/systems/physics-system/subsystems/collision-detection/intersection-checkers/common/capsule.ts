import { Vector2 } from '../../../../../../../engine/math-lib';
import type {
  CapsuleGeometry,
  Intersection,
  SegmentGeometry,
} from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';

import { getClosestPointsBetweenSegments } from './segment-distance';

/**
 * Builds a segment/capsule-style manifold from the closest points between
 * center segments.
 *
 * Segment-vs-capsule and capsule-vs-capsule both reduce to testing whether
 * two center segments are within the combined radius. The normal points from
 * the first segment toward the capsule axis; if the axes overlap exactly, the
 * capsule's stored normal provides a stable fallback direction. The contact is
 * then shifted from the capsule axis back to the capsule surface.
 */
export const buildSegmentCapsuleIntersection = (
  segment: SegmentGeometry | CapsuleGeometry,
  capsule: CapsuleGeometry,
  radius: number,
): Intersection | false => {
  const closest = getClosestPointsBetweenSegments(segment, capsule);

  if (closest.distance > radius + INTERSECTION_EPSILON) {
    return false;
  }

  const normal = new Vector2(
    closest.point2.x - closest.point1.x,
    closest.point2.y - closest.point1.y,
  );

  if (normal.magnitude === 0) {
    normal.x = capsule.normal.x;
    normal.y = capsule.normal.y;
  } else {
    normal.normalize();
  }

  return {
    normal,
    penetration: Math.max(0, radius - closest.distance),
    contactPoints: [
      {
        x: closest.point2.x - normal.x * capsule.radius,
        y: closest.point2.y - normal.y * capsule.radius,
      },
    ],
  };
};
