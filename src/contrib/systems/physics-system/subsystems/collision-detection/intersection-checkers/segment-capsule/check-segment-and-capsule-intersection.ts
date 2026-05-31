import type {
  CapsuleGeometry,
  Intersection,
  SegmentGeometry,
} from '../../types';
import { buildSegmentCapsuleIntersection } from '../common/capsule';
import { orientNormal } from '../common/normals';

/**
 * Checks a segment against a capsule.
 *
 * The capsule is treated as the Minkowski sum of its center segment and a
 * circle. We find the closest points between the finite segment and the
 * capsule axis; if their distance is within the capsule radius, the segment
 * intersects the swept volume. The normal is built from the tested segment
 * toward the capsule axis and falls back to the capsule normal when the axes
 * overlap exactly.
 */
export const checkSegmentAndCapsuleIntersection = (
  segment: SegmentGeometry,
  capsule: CapsuleGeometry,
): Intersection | false => {
  const intersection = buildSegmentCapsuleIntersection(
    segment,
    capsule,
    capsule.radius,
  );

  if (!intersection) {
    return false;
  }

  return {
    ...intersection,
    normal: orientNormal(intersection.normal, segment.center, capsule.center),
  };
};
