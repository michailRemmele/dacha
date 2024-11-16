import { ColliderContainer } from '../../../../../components';
import { MathOps, Vector2, VectorOps } from '../../../../../../engine/math-lib';
import type {
  CollisionEntry,
  BoxGeometry,
  CircleGeometry,
  Point,
  Edge,
  Intersection,
} from '../types';

const getMtvs = (edge: Edge, overlap: number, point1: Point, point2: Point): Intersection => {
  const vector = new Vector2(
    edge.point2.x - edge.point1.x,
    edge.point2.y - edge.point1.y,
  );
  vector.multiplyNumber((1 / vector.magnitude) * overlap);

  const positiveX = Math.abs(vector.x);
  const negativeX = -Math.abs(vector.x);
  const positiveY = Math.abs(vector.y);
  const negativeY = -Math.abs(vector.y);

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
  if (arg1.actor.getComponent(ColliderContainer).type === 'boxCollider') {
    box = arg1.geometry as BoxGeometry;
    circle = arg2.geometry as CircleGeometry;
  } else {
    box = arg2.geometry as BoxGeometry;
    circle = arg1.geometry as CircleGeometry;
  }

  let isIntersection = false;
  let minDistance = Infinity;
  let minDistanceEdge: Edge = box.edges[0];

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

    let distance = distanceProjection;
    let distanceEdge = { point1: circleCenter, point2: projectedPoint };

    if (distance1 < distance) {
      distance = distance1;
      distanceEdge = { point1: circleCenter, point2: edge.point1 };
    }
    if (distance2 < distance) {
      distance = distance2;
      distanceEdge = { point1: circleCenter, point2: edge.point2 };
    }

    const isInsideCircle = distance < circle.radius;

    isIntersection = isIntersection || isInsideCircle;

    if (isInsideCircle && distance < minDistance) {
      minDistance = distance;
      minDistanceEdge = distanceEdge;
    }
  }

  const isInsidePolygon = VectorOps.isPointInPolygon(circleCenter, box.edges);

  if (!isIntersection && !isInsidePolygon) {
    return false;
  }

  return getMtvs(
    minDistanceEdge,
    isInsidePolygon ? circle.radius + minDistance : circle.radius - minDistance,
    arg1.geometry.center,
    arg2.geometry.center,
  );
};
