import {
  MathOps,
  Vector2,
  VectorOps,
} from '../../../../../../../engine/math-lib';
import type {
  BoxGeometry,
  CircleGeometry,
  Intersection,
  EdgeWithNormal,
  Point,
} from '../../types';
import { isGreaterThan } from '../../utils';
import { orientNormal } from '../common/normals';

const buildNormal = (
  circle: CircleGeometry,
  closestEdge: EdgeWithNormal,
  closestPoint: Point,
): Vector2 => {
  let normal = new Vector2(
    circle.center.x - closestPoint.x,
    circle.center.y - closestPoint.y,
  );

  if (normal.magnitude === 0) {
    normal = closestEdge.normal.clone();
  }

  return normal.normalize();
};

/**
 * Checks box and circle colliders for intersection.
 *
 * The closest point on the box is used as the world-space contact point.
 * For circles inside the box, the nearest face normal is used as the
 * collision direction and penetration is measured to that face.
 */
export const checkBoxAndCircleIntersection = (
  box: BoxGeometry,
  circle: CircleGeometry,
): Intersection | false => {
  let closestEdge = box.edges[0];
  let closestPoint = box.points[0];
  let minDistance = Infinity;

  box.edges.forEach((edge) => {
    const candidate = VectorOps.getClosestPointOnEdge(circle.center, edge);
    const distance = MathOps.getDistanceBetweenTwoPoints(
      candidate.x,
      circle.center.x,
      candidate.y,
      circle.center.y,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestEdge = edge;
      closestPoint = candidate;
    }
  });

  const isCircleInsideBox = VectorOps.isPointInPolygon(
    circle.center,
    box.edges,
  );

  if (!isCircleInsideBox && isGreaterThan(minDistance, circle.radius)) {
    return false;
  }

  const penetration = isCircleInsideBox
    ? circle.radius + minDistance
    : Math.max(0, circle.radius - minDistance);

  return {
    normal: orientNormal(
      buildNormal(circle, closestEdge, closestPoint),
      box.center,
      circle.center,
    ),
    penetration,
    contactPoints: [closestPoint],
  };
};
