import { Vector2, VectorOps, MathOps } from '../../../../../../engine/math-lib';
import type { Proxy, BoxGeometry, Intersection, Point } from '../types';

interface PolygonProjection {
  min: number;
  max: number;
}

const CONTACT_EPSILON = 1e-6;
const MAX_CONTACT_POINTS = 2;

const projectPolygon = (
  polygon: BoxGeometry,
  axisVector: Vector2,
): PolygonProjection => {
  const initialProjectionValue = VectorOps.dotProduct(
    polygon.edges[0].point1,
    axisVector,
  );

  const projection = {
    min: initialProjectionValue,
    max: initialProjectionValue,
  };

  for (let i = 1; i < polygon.edges.length; i += 1) {
    const projectionValue = VectorOps.dotProduct(
      polygon.edges[i].point1,
      axisVector,
    );

    if (projectionValue < projection.min) {
      projection.min = projectionValue;
    } else if (projectionValue > projection.max) {
      projection.max = projectionValue;
    }
  }

  return projection;
};

const getSupportPoints = (
  polygon: BoxGeometry,
  axis: Vector2,
  direction: number,
): Point[] => {
  let target = direction > 0 ? -Infinity : Infinity;

  polygon.points.forEach((point) => {
    const projection = VectorOps.dotProduct(point, axis);

    if (direction > 0) {
      target = Math.max(target, projection);
    } else {
      target = Math.min(target, projection);
    }
  });

  return polygon.points.filter((point) => {
    const projection = VectorOps.dotProduct(point, axis);

    return Math.abs(projection - target) <= CONTACT_EPSILON;
  });
};

const getClosestPointOnPolygon = (
  point: Point,
  polygon: BoxGeometry,
): Point => {
  let minDistance = Infinity;
  let closestPoint = polygon.points[0];

  polygon.edges.forEach((edge) => {
    const candidate = VectorOps.getClosestPointOnEdge(point, edge);
    const distance = MathOps.getDistanceBetweenTwoPoints(
      candidate.x,
      point.x,
      candidate.y,
      point.y,
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = candidate;
    }
  });

  return closestPoint;
};

const toMidpoint = (point1: Point, point2: Point): Point => ({
  x: (point1.x + point2.x) / 2,
  y: (point1.y + point2.y) / 2,
});

const dedupePoints = (points: Point[]): Point[] => {
  const unique: Point[] = [];

  for (const point of points) {
    if (
      unique.some(
        (entry) =>
          Math.abs(entry.x - point.x) <= CONTACT_EPSILON &&
          Math.abs(entry.y - point.y) <= CONTACT_EPSILON,
      )
    ) {
      continue;
    }

    unique.push(point);

    if (unique.length === MAX_CONTACT_POINTS) {
      return unique;
    }
  }

  return unique;
};

/**
 * Checks boxes colliders at the intersection.
 * The SAT (separating axis theorem) is used to determine an intersection manifold.
 */
export const checkBoxesIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  let overlap = Infinity;
  let normal: Vector2 | undefined;

  const geometry1 = arg1.geometry as BoxGeometry;
  const geometry2 = arg2.geometry as BoxGeometry;

  // Consider arg1 box normals as axes
  for (const edge of geometry1.edges) {
    const axis = edge.normal;

    const aProjection = projectPolygon(geometry1, axis);
    const bProjection = projectPolygon(geometry2, axis);

    const aDistance = aProjection.min - bProjection.max;
    const bDistance = bProjection.min - aProjection.max;

    if (aDistance > 0 || bDistance > 0) {
      return false;
    }

    const axisOverlap = Math.min(Math.abs(aDistance), Math.abs(bDistance));
    if (axisOverlap < overlap) {
      overlap = axisOverlap;
      normal = axis;
    }
  }

  // Consider arg2 box normals as axes
  for (const edge of geometry2.edges) {
    const axis = edge.normal;

    const aProjection = projectPolygon(geometry1, axis);
    const bProjection = projectPolygon(geometry2, axis);

    const aDistance = aProjection.min - bProjection.max;
    const bDistance = bProjection.min - aProjection.max;

    if (aDistance > 0 || bDistance > 0) {
      return false;
    }

    const axisOverlap = Math.min(Math.abs(aDistance), Math.abs(bDistance));
    if (axisOverlap < overlap) {
      overlap = axisOverlap;
      normal = axis;
    }
  }

  const { x: xArg1, y: yArg1 } = geometry1.center;
  const { x: xArg2, y: yArg2 } = geometry2.center;

  normal = (normal as Vector2).clone();

  const direction = new Vector2(xArg2 - xArg1, yArg2 - yArg1);
  if (VectorOps.dotProduct(direction, normal) < 0) {
    normal.multiplyNumber(-1);
  }

  const supportPoints1 = getSupportPoints(geometry1, normal, 1);
  const supportPoints2 = getSupportPoints(geometry2, normal, -1);

  const targetSupportPoints =
    supportPoints1.length <= supportPoints2.length
      ? supportPoints1
      : supportPoints2;
  const targetGeometry =
    supportPoints1.length <= supportPoints2.length ? geometry2 : geometry1;

  for (let i = 0; i < targetSupportPoints.length; i += 1) {
    targetSupportPoints[i] = toMidpoint(
      targetSupportPoints[i],
      getClosestPointOnPolygon(targetSupportPoints[i], targetGeometry),
    );
  }

  return {
    normal,
    penetration: overlap,
    contactPoints: dedupePoints(targetSupportPoints),
  };
};
