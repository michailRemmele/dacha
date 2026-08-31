import type { CapsuleGeometry, Intersection } from '../../types';
import { buildSegmentCapsuleIntersection } from '../common/capsule';
import { orientNormal } from '../common/normals';

/**
 * Checks two capsules for intersection.
 *
 * Each capsule is represented by its center segment swept by a radius. The
 * closest points between the two finite center segments define the collision
 * direction. The capsules overlap when that segment distance is less than or
 * equal to the sum of both radii.
 *
 * The contact point is placed on the surface
 * of the second capsule along the separating direction, matching the manifold
 * orientation used by the other pair checkers.
 */
export const checkCapsulesIntersection = (
  capsule1: CapsuleGeometry,
  capsule2: CapsuleGeometry,
): Intersection | false => {
  const intersection = buildSegmentCapsuleIntersection(
    capsule1,
    capsule2,
    capsule1.radius + capsule2.radius,
  );

  if (!intersection) {
    return false;
  }

  return {
    ...intersection,
    normal: orientNormal(intersection.normal, capsule1.center, capsule2.center),
  };
};
