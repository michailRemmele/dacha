import { Vector2, VectorOps } from '../../../../../../engine/math-lib';
import type { CollisionEntry, BoxGeometry, Intersection } from '../types';

interface PolygonProjection {
  min: number
  max: number
}

const projectPolygon = (polygon: BoxGeometry, axisVector: Vector2): PolygonProjection => {
  const initialProjectionValue = VectorOps.dotProduct(polygon.edges[0].point1, axisVector);

  const projection = {
    min: initialProjectionValue,
    max: initialProjectionValue,
  };

  for (let i = 1; i < polygon.edges.length; i += 1) {
    const projectionValue = VectorOps.dotProduct(polygon.edges[i].point1, axisVector);

    if (projectionValue < projection.min) {
      projection.min = projectionValue;
    } else if (projectionValue > projection.max) {
      projection.max = projectionValue;
    }
  }

  return projection;
};

/**
  * Checks boxes colliders at the intersection.
  * The SAT (separating axis theorem) is used to determine an intersection and mtvs.
  */
export const checkBoxesIntersection = (
  arg1: CollisionEntry,
  arg2: CollisionEntry,
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

  const mtv = (normal as Vector2).clone();
  mtv.multiplyNumber(overlap);

  const positiveX = Math.abs(mtv.x);
  const negativeX = -Math.abs(mtv.x);
  const positiveY = Math.abs(mtv.y);
  const negativeY = -Math.abs(mtv.y);

  return {
    mtv1: new Vector2(
      xArg1 < xArg2 ? negativeX : positiveX,
      yArg1 < yArg2 ? negativeY : positiveY,
    ),
    mtv2: new Vector2(
      xArg2 > xArg1 ? positiveX : negativeX,
      yArg2 > yArg1 ? positiveY : negativeY,
    ),
  };
};
