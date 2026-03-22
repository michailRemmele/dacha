import { Collider } from '../../../../../components';
import { MathOps, Vector2, VectorOps } from '../../../../../../engine/math-lib';
import type {
  Proxy,
  BoxGeometry,
  CircleGeometry,
  Point,
  Intersection,
} from '../types';

const buildIntersection = (
  normal: Vector2,
  penetration: number,
  from: Point,
  to: Point,
  contactPoint: Point,
): Intersection => {
  normal.normalize();
  if (normal.magnitude === 0) {
    normal.x = 1;
  }

  if (normal.x * (to.x - from.x) + normal.y * (to.y - from.y) < 0) {
    normal.multiplyNumber(-1);
  }

  return {
    normal,
    penetration,
    contactPoints: [contactPoint],
  };
};

/**
 * Checks box and circle colliders at the intersection.
 * The main target is to check two possible scenarios:
 * - circle lies inside box
 * - circle intersects one of the boxe's edges
 * Steps of the algorithm:
 * 1. Find the nearest edge to circle center and check wether it intersects with circle or not
 *    For each edge three points should be considered: corners and circle center projection
 * 2. Determine is the circle center lies inside of the box or not.
 *    This affects how penetration depth should be computed.
 * 3. If circle doesn't have any intersection with boxe's edges
 *    and circle center lies outside of the box – return false.
 *    Otherwise compute the collision normal and contact point considering relative positions.
 */
export const checkBoxAndCircleIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  let box: BoxGeometry;
  let circle: CircleGeometry;
  if (arg1.actor.getComponent(Collider).type === 'box') {
    box = arg1.geometry as BoxGeometry;
    circle = arg2.geometry as CircleGeometry;
  } else {
    box = arg2.geometry as BoxGeometry;
    circle = arg1.geometry as CircleGeometry;
  }

  let minDistance = Infinity;
  let closestPoint = box.points[0];

  const { center: circleCenter } = circle;

  for (const edge of box.edges) {
    const closestEdgePoint = VectorOps.getClosestPointOnEdge(
      circleCenter,
      edge,
    );
    const distance = MathOps.getDistanceBetweenTwoPoints(
      circleCenter.x,
      closestEdgePoint.x,
      circleCenter.y,
      closestEdgePoint.y,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = closestEdgePoint;
    }
  }

  const isInsidePolygon = VectorOps.isPointInPolygon(circleCenter, box.edges);
  const isIntersection = isInsidePolygon || minDistance < circle.radius;

  if (!isIntersection) {
    return false;
  }

  const normal = new Vector2(
    closestPoint.x - circleCenter.x,
    closestPoint.y - circleCenter.y,
  );

  return buildIntersection(
    normal,
    isInsidePolygon ? circle.radius + minDistance : circle.radius - minDistance,
    arg1.geometry.center,
    arg2.geometry.center,
    closestPoint,
  );
};
