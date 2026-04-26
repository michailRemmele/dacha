import type {
  CapsuleGeometry,
  Intersection,
  Proxy,
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
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const segment = arg1.geometry as SegmentGeometry;
  const capsule = arg2.geometry as CapsuleGeometry;
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
    normal: orientNormal(
      intersection.normal,
      segment.center,
      capsule.center,
    ),
  };
};
