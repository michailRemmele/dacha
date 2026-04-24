import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import type { BoxGeometry, EdgeWithNormal, Point } from '../../types';
import { INTERSECTION_EPSILON, projectPolygon } from '../utils';

export const CONTACT_EPSILON = 1e-4;
export const MAX_CONTACT_POINTS = 2;

export interface AxisOverlap {
  axis: Vector2;
  overlap: number;
}

export const findMinBoxesOverlap = (
  geometry1: BoxGeometry,
  geometry2: BoxGeometry,
): AxisOverlap | false => {
  let minOverlap = Infinity;
  let bestAxis = geometry1.edges[0].normal;

  for (const edge of geometry1.edges) {
    const axis = edge.normal;

    const projection1 = projectPolygon(geometry1.points, axis);
    const projection2 = projectPolygon(geometry2.points, axis);

    const distance1 = projection1.min - projection2.max;
    const distance2 = projection2.min - projection1.max;

    if (distance1 > INTERSECTION_EPSILON || distance2 > INTERSECTION_EPSILON) {
      return false;
    }

    const overlap = Math.min(Math.abs(distance1), Math.abs(distance2));

    if (overlap < minOverlap) {
      minOverlap = overlap;
      bestAxis = axis;
    }
  }

  return {
    axis: bestAxis,
    overlap: minOverlap,
  };
};

const clipSegmentToLine = (
  vertices: Point[],
  normal: Vector2,
  offset: number,
): Point[] => {
  const clipped: Point[] = [];

  const distance1 = VectorOps.dotProduct(vertices[0], normal) - offset;
  const distance2 = VectorOps.dotProduct(vertices[1], normal) - offset;

  if (distance1 <= CONTACT_EPSILON) {
    clipped.push(vertices[0]);
  }

  if (distance2 <= CONTACT_EPSILON) {
    clipped.push(vertices[1]);
  }

  if (distance1 * distance2 < 0) {
    const t = distance1 / (distance1 - distance2);
    const point1 = vertices[0];
    const point2 = vertices[1];

    clipped.push({
      x: point1.x + (point2.x - point1.x) * t,
      y: point1.y + (point2.y - point1.y) * t,
    });
  }

  return clipped;
};

const getMostAntiParallelEdge = (
  polygon: BoxGeometry,
  normal: Vector2,
): EdgeWithNormal => {
  let bestEdge = polygon.edges[0];
  let minDot = VectorOps.dotProduct(bestEdge.normal, normal);

  for (const edge of polygon.edges) {
    const dot = VectorOps.dotProduct(edge.normal, normal);

    if (dot < minDot) {
      minDot = dot;
      bestEdge = edge;
    }
  }

  return bestEdge;
};

const getMostParallelEdge = (
  polygon: BoxGeometry,
  normal: Vector2,
): EdgeWithNormal => {
  let bestEdge = polygon.edges[0];
  let maxDot = VectorOps.dotProduct(bestEdge.normal, normal);

  for (const edge of polygon.edges) {
    const dot = VectorOps.dotProduct(edge.normal, normal);

    if (dot > maxDot) {
      maxDot = dot;
      bestEdge = edge;
    }
  }

  return bestEdge;
};

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
 * Builds up to two box-vs-box contact points by clipping the incident edge
 * against the side planes of the reference edge.
 *
 * The returned points lie on the reference face plane, which makes them
 * suitable to use as world-space contact points in a simple impulse solver.
 */
export const buildContactPoints = (
  referencePolygon: BoxGeometry,
  referenceNormal: Vector2,
  incidentPolygon: BoxGeometry,
): Point[] => {
  const referenceEdge = getMostParallelEdge(referencePolygon, referenceNormal);
  const incidentEdge = getMostAntiParallelEdge(
    incidentPolygon,
    referenceNormal,
  );

  const tangent = new Vector2(
    referenceEdge.point2.x - referenceEdge.point1.x,
    referenceEdge.point2.y - referenceEdge.point1.y,
  );
  tangent.normalize();

  const minTangentOffset = VectorOps.dotProduct(referenceEdge.point1, tangent);
  const maxTangentOffset = VectorOps.dotProduct(referenceEdge.point2, tangent);

  let clippedPoints: Point[] = [incidentEdge.point1, incidentEdge.point2];

  clippedPoints = clipSegmentToLine(clippedPoints, tangent, maxTangentOffset);

  if (clippedPoints.length === 0) {
    return [];
  }

  if (clippedPoints.length === 2) {
    tangent.multiplyNumber(-1);

    clippedPoints = clipSegmentToLine(
      clippedPoints,
      tangent,
      -minTangentOffset,
    );

    if (clippedPoints.length === 0) {
      return [];
    }
  }

  const frontOffset = VectorOps.dotProduct(
    referenceEdge.point1,
    referenceNormal,
  );
  const contacts: Point[] = [];

  clippedPoints.forEach((point) => {
    const separation =
      VectorOps.dotProduct(point, referenceNormal) - frontOffset;

    if (separation > CONTACT_EPSILON) {
      return;
    }

    contacts.push({
      x: point.x - referenceNormal.x * separation,
      y: point.y - referenceNormal.y * separation,
    });
  });

  return dedupePoints(contacts);
};
