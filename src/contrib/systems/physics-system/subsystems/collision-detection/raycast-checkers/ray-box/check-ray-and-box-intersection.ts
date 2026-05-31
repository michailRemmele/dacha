import { VectorOps, type Vector2 } from '../../../../../../../engine/math-lib';
import type { BoxGeometry, EdgeWithNormal } from '../../types';
import {
  isGreaterThan,
  isDefinitelyNegative,
  isDefinitelyPositive,
  isZero,
} from '../../utils';
import type { RaycastCheckerFn } from '../types';

/**
 * Checks a ray against a convex box using half-space clipping.
 *
 * The intersection interval is clipped against each box face.
 * - `tEnter` tracks the first point where the ray enters the box
 * - `tExit` tracks the first point where the ray leaves the box
 *
 * When the ray starts inside the box, the first hit is the exit point.
 */
export const checkRayAndBoxIntersection: RaycastCheckerFn<BoxGeometry> = (
  ray,
  box,
) => {
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

    if (isZero(denominator)) {
      if (isDefinitelyPositive(signedDistance)) {
        return false;
      }

      continue;
    }

    const t = -signedDistance / denominator;

    if (isDefinitelyNegative(denominator)) {
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

    if (isGreaterThan(tEnter, tExit)) {
      return false;
    }
  }

  if (isDefinitelyNegative(tExit) || isGreaterThan(tEnter, ray.maxDistance)) {
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
    point: hitPoint,
  };
};
