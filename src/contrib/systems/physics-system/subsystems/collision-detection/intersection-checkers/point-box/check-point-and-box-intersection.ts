import { VectorOps } from '../../../../../../../engine/math-lib';
import type {
  BoxGeometry,
  PointGeometry,
  Intersection,
  EdgeWithNormal,
} from '../../types';
import { isDefinitelyPositive, isZero } from '../../utils';
import { orientNormal } from '../common/normals';

/**
 * Checks point and box colliders for intersection.
 *
 * The manifold uses the nearest point on the box boundary as the contact.
 * For points inside the box, penetration is the distance to the nearest edge.
 * When the point lies exactly on the boundary, penetration is reported as zero.
 */
export const checkPointAndBoxIntersection = (
  point: PointGeometry,
  box: BoxGeometry,
): Intersection | false => {
  let bestEdge: EdgeWithNormal = box.edges[0];
  let bestSignedDistance = -Infinity;

  for (const edge of box.edges) {
    const signedDistance = VectorOps.dotProduct(
      {
        x: point.center.x - edge.point1.x,
        y: point.center.y - edge.point1.y,
      },
      edge.normal,
    );

    if (isDefinitelyPositive(signedDistance)) {
      return false;
    }

    if (signedDistance > bestSignedDistance) {
      bestSignedDistance = signedDistance;
      bestEdge = edge;
    }
  }

  const contactPoint = VectorOps.getClosestPointOnEdge(point.center, bestEdge);
  const isPointOnBoxBoundary = isZero(bestSignedDistance);

  return {
    normal: orientNormal(bestEdge.normal.clone(), point.center, box.center),
    penetration: isPointOnBoxBoundary ? 0 : -bestSignedDistance,
    contactPoints: [contactPoint],
  };
};
