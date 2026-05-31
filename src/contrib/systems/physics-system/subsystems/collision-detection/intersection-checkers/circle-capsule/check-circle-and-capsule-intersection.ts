import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import type {
  CapsuleGeometry,
  CircleGeometry,
  Intersection,
} from '../../types';
import { isGreaterThan } from '../../utils';
import { orientNormal } from '../common/normals';

/**
 * Checks a circle against a capsule.
 *
 * This is equivalent to checking a point against a capsule with an expanded
 * radius. The circle center is projected onto the capsule axis segment, then
 * the distance from that closest point is compared with
 * `capsule.radius + circle.radius`. The contact point lies on the capsule
 * surface in the direction of the circle center.
 */
export const checkCircleAndCapsuleIntersection = (
  circle: CircleGeometry,
  capsule: CapsuleGeometry,
): Intersection | false => {
  const closestPoint = VectorOps.getClosestPointOnEdge(circle.center, capsule);
  const normal = new Vector2(
    circle.center.x - closestPoint.x,
    circle.center.y - closestPoint.y,
  );
  const distance = normal.magnitude;
  const radiusSum = capsule.radius + circle.radius;

  if (isGreaterThan(distance, radiusSum)) {
    return false;
  }

  if (distance === 0) {
    normal.x = capsule.normal.x;
    normal.y = capsule.normal.y;
  } else {
    normal.normalize();
  }

  return {
    normal: orientNormal(normal, circle.center, capsule.center),
    penetration: Math.max(0, radiusSum - distance),
    contactPoints: [
      {
        x: closestPoint.x + normal.x * capsule.radius,
        y: closestPoint.y + normal.y * capsule.radius,
      },
    ],
  };
};
