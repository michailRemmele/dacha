import {
  MathOps,
  Vector2,
  VectorOps,
} from '../../../../../../../engine/math-lib';
import type {
  BoxGeometry,
  CapsuleGeometry,
  Point,
  Intersection,
} from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';
import { orientNormal } from '../common/normals';
import { arePointsEqual, lerpPoint } from '../common/points';
import {
  getProjectionOverlap,
  projectPolygon,
  projectSegment,
} from '../common/projections';
import { getClosestPointsBetweenSegments } from '../common/segment-distance';

/**
 * Clips the capsule axis to the portion that lies inside the box.
 *
 * A capsule is a segment swept by a radius, so when the best collision axis is
 * a face-like axis we first find the interval of the center segment that
 * survives all box half-spaces. The resulting endpoint(s) are then shifted by
 * the capsule radius opposite the contact normal so the manifold lies on the
 * capsule surface rather than on its center line.
 */
const buildAxisContactPoints = (
  box: BoxGeometry,
  capsule: CapsuleGeometry,
  normal: Vector2,
): Point[] => {
  let start = 0;
  let end = 1;

  for (const edge of box.edges) {
    const offset = VectorOps.dotProduct(edge.point1, edge.normal);
    const point1Distance =
      VectorOps.dotProduct(capsule.point1, edge.normal) - offset;
    const point2Distance =
      VectorOps.dotProduct(capsule.point2, edge.normal) - offset;

    if (
      point1Distance > INTERSECTION_EPSILON &&
      point2Distance > INTERSECTION_EPSILON
    ) {
      return [];
    }

    if (
      point1Distance <= INTERSECTION_EPSILON &&
      point2Distance <= INTERSECTION_EPSILON
    ) {
      continue;
    }

    const denominator = point1Distance - point2Distance;
    const t = denominator === 0 ? 0 : point1Distance / denominator;

    if (point1Distance > INTERSECTION_EPSILON) {
      start = Math.max(start, t);
    } else {
      end = Math.min(end, t);
    }

    if (start > end + INTERSECTION_EPSILON) {
      return [];
    }
  }

  const contact1 = lerpPoint(
    capsule.point1,
    capsule.point2,
    MathOps.clamp(start, 0, 1),
  );
  contact1.x -= normal.x * capsule.radius;
  contact1.y -= normal.y * capsule.radius;

  if (Math.abs(end - start) <= INTERSECTION_EPSILON) {
    return [contact1];
  }

  const contact2 = lerpPoint(
    capsule.point1,
    capsule.point2,
    MathOps.clamp(end, 0, 1),
  );
  contact2.x -= normal.x * capsule.radius;
  contact2.y -= normal.y * capsule.radius;

  return arePointsEqual(contact1, contact2) ? [contact1] : [contact1, contact2];
};

const getAxisOverlap = (
  box: BoxGeometry,
  capsule: CapsuleGeometry,
  axis: Vector2,
): number | false => {
  const boxProjection = projectPolygon(box.points, axis);
  const segmentProjection = projectSegment(
    capsule.point1,
    capsule.point2,
    axis,
  );
  const capsuleMin = segmentProjection.min - capsule.radius;
  const capsuleMax = segmentProjection.max + capsule.radius;
  return getProjectionOverlap(
    capsuleMin,
    capsuleMax,
    boxProjection.min,
    boxProjection.max,
  );
};

/**
 * Builds a box-vs-capsule manifold using the cheapest valid path for the
 * contact shape.
 *
 * Edge-to-axis distance handles the common side/corner case directly: if the
 * closest box edge and capsule axis are farther apart than the capsule radius,
 * the shapes are separated; otherwise the closest box point is already a good
 * contact. When the axis penetrates or lies inside the box, distance alone
 * cannot pick a stable separation direction, so the function falls back to SAT
 * over the box face normals plus the capsule axis normal. The chosen SAT axis
 * gives penetration depth, and clipped axis contacts produce one or two
 * surface points for deeper face-like overlaps.
 */
export const buildBoxCapsuleIntersection = (
  box: BoxGeometry,
  capsule: CapsuleGeometry,
): Intersection | false => {
  let closestBoxPoint = box.points[0];
  let closestCapsulePoint = capsule.point1;
  let minDistance = Infinity;

  for (const edge of box.edges) {
    const closest = getClosestPointsBetweenSegments(edge, capsule);

    if (closest.distance < minDistance) {
      minDistance = closest.distance;
      closestBoxPoint = closest.point1;
      closestCapsulePoint = closest.point2;
    }
  }

  if (VectorOps.isPointInPolygon(capsule.point1, box.edges)) {
    minDistance = 0;
    closestBoxPoint = capsule.point1;
    closestCapsulePoint = capsule.point1;
  } else if (VectorOps.isPointInPolygon(capsule.point2, box.edges)) {
    minDistance = 0;
    closestBoxPoint = capsule.point2;
    closestCapsulePoint = capsule.point2;
  }

  if (minDistance > capsule.radius + INTERSECTION_EPSILON) {
    return false;
  }

  if (minDistance > INTERSECTION_EPSILON) {
    const normal = new Vector2(
      closestCapsulePoint.x - closestBoxPoint.x,
      closestCapsulePoint.y - closestBoxPoint.y,
    ).normalize();

    return {
      normal,
      penetration: Math.max(0, capsule.radius - minDistance),
      contactPoints: [closestBoxPoint],
    };
  }

  let minOverlap = Infinity;
  let bestAxis = box.edges[0].normal;

  for (let i = 0; i < 2; i += 1) {
    const edge = box.edges[i];
    const overlap = getAxisOverlap(box, capsule, edge.normal);

    if (overlap === false) {
      return false;
    }

    if (overlap < minOverlap) {
      minOverlap = overlap;
      bestAxis = edge.normal;
    }
  }

  const capsuleAxisOverlap = getAxisOverlap(box, capsule, capsule.normal);

  if (capsuleAxisOverlap === false) {
    return false;
  }

  if (capsuleAxisOverlap < minOverlap) {
    minOverlap = capsuleAxisOverlap;
    bestAxis = capsule.normal;
  }

  const contactNormal = orientNormal(
    bestAxis.clone(),
    box.center,
    capsule.center,
  );
  const contactPoints = buildAxisContactPoints(box, capsule, contactNormal);

  return {
    normal: bestAxis.clone(),
    penetration: minOverlap,
    contactPoints: contactPoints.length > 0 ? contactPoints : [closestBoxPoint],
  };
};
