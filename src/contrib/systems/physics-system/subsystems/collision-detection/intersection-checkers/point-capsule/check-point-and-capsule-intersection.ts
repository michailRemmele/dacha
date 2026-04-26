import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import type {
  CapsuleGeometry,
  Intersection,
  PointGeometry,
  Proxy,
} from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';
import { orientNormal } from '../common/normals';

/**
 * Checks whether a point lies inside a capsule.
 *
 * The point is projected onto the capsule axis segment. If the distance from
 * the point to that closest axis point is within the capsule radius, the point
 * overlaps the swept circle volume. The point itself is returned as the
 * contact point, and the normal points from the axis toward the point.
 */
export const checkPointAndCapsuleIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const point = arg1.geometry as PointGeometry;
  const capsule = arg2.geometry as CapsuleGeometry;
  const closestPoint = VectorOps.getClosestPointOnEdge(point.center, capsule);
  const normal = new Vector2(
    point.center.x - closestPoint.x,
    point.center.y - closestPoint.y,
  );
  const distance = normal.magnitude;

  if (distance > capsule.radius + INTERSECTION_EPSILON) {
    return false;
  }

  if (distance === 0) {
    normal.x = capsule.normal.x;
    normal.y = capsule.normal.y;
  } else {
    normal.normalize();
  }

  return {
    normal: orientNormal(normal, point.center, capsule.center),
    penetration: Math.max(0, capsule.radius - distance),
    contactPoints: [point.center],
  };
};
