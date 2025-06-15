import { Collider } from '../../../../../components';
import { MathOps, Vector2, VectorOps } from '../../../../../../engine/math-lib';
import type {
  CollisionEntry,
  BoxGeometry,
  CircleGeometry,
  Point,
  Intersection,
} from '../types';

const getMtvs = (axis: Vector2, overlap: number, point1: Point, point2: Point): Intersection => {
  axis.multiplyNumber((1 / axis.magnitude) * overlap);

  const positiveX = Math.abs(axis.x);
  const negativeX = -Math.abs(axis.x);
  const positiveY = Math.abs(axis.y);
  const negativeY = -Math.abs(axis.y);

  return {
    mtv1: new Vector2(
      point1.x < point2.x ? negativeX : positiveX,
      point1.y < point2.y ? negativeY : positiveY,
    ),
    mtv2: new Vector2(
      point2.x > point1.x ? positiveX : negativeX,
      point2.y > point1.y ? positiveY : negativeY,
    ),
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
  *    This affects how we should compute mtv distance
  * 3. If circle doesn't have any intersection with boxe's edges
  *    and circle center lies outside of the box – return false.
  *    Otherwise compute mtv vectors considering relative position of circle and box centers
  */
export const checkBoxAndCircleIntersection = (
  arg1: CollisionEntry,
  arg2: CollisionEntry,
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

  let isIntersection = false;
  let minDistance = Infinity;
  let minDistanceAxis: Vector2;

  const { center: circleCenter } = circle;

  for (const edge of box.edges) {
    const projectedPoint = VectorOps.projectPointToEdge(circleCenter, edge);

    const minX = Math.min(edge.point1.x, edge.point2.x);
    const maxX = Math.max(edge.point1.x, edge.point2.x);

    const minY = Math.min(edge.point1.y, edge.point2.y);
    const maxY = Math.max(edge.point1.y, edge.point2.y);

    const isPointOnEdge = projectedPoint.x >= minX
      && projectedPoint.x <= maxX
      && projectedPoint.y >= minY
      && projectedPoint.y <= maxY;

    const distanceProjection = isPointOnEdge ? MathOps.getDistanceBetweenTwoPoints(
      circleCenter.x,
      projectedPoint.x,
      circleCenter.y,
      projectedPoint.y,
    ) : Infinity;
    const distance1 = MathOps.getDistanceBetweenTwoPoints(
      circleCenter.x,
      edge.point1.x,
      circleCenter.y,
      edge.point1.y,
    );
    const distance2 = MathOps.getDistanceBetweenTwoPoints(
      circleCenter.x,
      edge.point2.x,
      circleCenter.y,
      edge.point2.y,
    );

    const isInsideCircle = Math.min(distanceProjection, distance1, distance2) < circle.radius;
    isIntersection = isIntersection || isInsideCircle;

    if (isPointOnEdge && distanceProjection < minDistance) {
      minDistance = distanceProjection;
      minDistanceAxis = edge.normal.clone();
    }
    if (distance1 < minDistance) {
      minDistance = distance1;
      minDistanceAxis = minDistance !== 0
        ? new Vector2(edge.point1.x - circleCenter.x, edge.point1.y - circleCenter.y)
        : edge.normal.clone();
    }
    if (distance2 < minDistance) {
      minDistance = distance2;
      minDistanceAxis = minDistance !== 0
        ? new Vector2(edge.point2.x - circleCenter.x, edge.point2.y - circleCenter.y)
        : edge.normal.clone();
    }
  }

  const isInsidePolygon = VectorOps.isPointInPolygon(circleCenter, box.edges);

  if (!isIntersection && !isInsidePolygon) {
    return false;
  }

  return getMtvs(
    minDistanceAxis!,
    isInsidePolygon ? circle.radius + minDistance : circle.radius - minDistance,
    arg1.geometry.center,
    arg2.geometry.center,
  );
};
