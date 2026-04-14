import { VectorOps, type Vector2 } from '../../../../../../../engine/math-lib';
import type {
  Proxy,
  BoxGeometry,
  RayGeometry,
  EdgeWithNormal,
  Intersection,
} from '../../types';
import { INTERSECTION_EPSILON } from '../utils';

/**
 * Checks a ray against a convex box using half-space clipping.
 *
 * The intersection interval is clipped against each box face.
 * - `tEnter` tracks the first point where the ray enters the box
 * - `tExit` tracks the first point where the ray leaves the box
 *
 * When the ray starts inside the box, the first hit is the exit point.
 */
export const checkRayAndBoxIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const isBoxFirst = 'edges' in arg1.geometry;
  const box = (isBoxFirst ? arg1.geometry : arg2.geometry) as BoxGeometry;
  const ray = (isBoxFirst ? arg2.geometry : arg1.geometry) as RayGeometry;

  let tEnter = -Infinity;
  let tExit = ray.maxDistance;
  let enterEdge: EdgeWithNormal | null = null;
  let exitEdge: EdgeWithNormal | null = null;

  for (const edge of box.edges) {
    const signedDistance = VectorOps.dotProduct(
      {
        x: ray.origin.x - edge.point1.x,
        y: ray.origin.y - edge.point1.y,
      },
      edge.normal,
    );

    const denominator = VectorOps.dotProduct(ray.direction, edge.normal);

    if (Math.abs(denominator) <= INTERSECTION_EPSILON) {
      if (signedDistance > INTERSECTION_EPSILON) {
        return false;
      }

      continue;
    }

    const t = -signedDistance / denominator;

    if (denominator < 0) {
      if (t > tEnter) {
        tEnter = t;
        enterEdge = edge;
      }
    } else {
      if (t < tExit) {
        tExit = t;
        exitEdge = edge;
      }
    }

    if (tEnter - tExit > INTERSECTION_EPSILON) {
      return false;
    }
  }

  if (
    tExit < -INTERSECTION_EPSILON ||
    tEnter > ray.maxDistance + INTERSECTION_EPSILON
  ) {
    return false;
  }

  const hitDistance = tEnter >= 0 ? tEnter : tExit;
  const hitEdge = tEnter >= 0 ? enterEdge : exitEdge;

  if (hitEdge === null) {
    return false;
  }

  const hitPoint = {
    x: ray.origin.x + ray.direction.x * hitDistance,
    y: ray.origin.y + ray.direction.y * hitDistance,
  };

  const normal: Vector2 = hitEdge.normal.clone();

  return {
    normal,
    distance: hitDistance,
    penetration: 0,
    contactPoints: [hitPoint],
  };
};
