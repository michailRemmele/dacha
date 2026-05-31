import { VectorOps } from '../../../../../../../engine/math-lib';
import type { SegmentGeometry } from '../../types';
import {
  isGreaterThan,
  isDefinitelyNegative,
  isDefinitelyPositive,
  isZero,
} from '../../utils';
import type { RaycastCheckerFn } from '../types';

import { subtractPoints } from './utils';

/**
 * Checks a ray against a finite segment.
 *
 * Both primitives are treated parametrically:
 * - the ray is `origin + direction * t`
 * - the segment is `point1 + (point2 - point1) * u`
 *
 * Solving the 2D line intersection gives `t` on the ray and `u` on the
 * segment. A hit is valid only when `t` lies within the ray length and
 * `u` lies within the finite segment interval `[0, 1]`.
 *
 * The contact normal comes from the segment normal and is flipped when needed
 * so it opposes the incoming ray direction.
 */
export const checkRayAndSegmentIntersection: RaycastCheckerFn<
  SegmentGeometry
> = (ray, segment) => {
  const segmentDirection = subtractPoints(segment.point2, segment.point1);
  const delta = subtractPoints(segment.point1, ray.origin);
  const denominator = VectorOps.crossProduct(ray.direction, segmentDirection);

  if (isZero(denominator)) {
    return false;
  }

  const rayDistance =
    VectorOps.crossProduct(delta, segmentDirection) / denominator;
  const segmentDistance =
    VectorOps.crossProduct(delta, ray.direction) / denominator;

  if (
    isDefinitelyNegative(rayDistance) ||
    isGreaterThan(rayDistance, ray.maxDistance) ||
    isDefinitelyNegative(segmentDistance) ||
    isGreaterThan(segmentDistance, 1)
  ) {
    return false;
  }

  const point = {
    x: ray.origin.x + ray.direction.x * rayDistance,
    y: ray.origin.y + ray.direction.y * rayDistance,
  };
  const normal = segment.normal.clone();

  if (
    isDefinitelyPositive(
      normal.x * ray.direction.x + normal.y * ray.direction.y,
    )
  ) {
    normal.multiplyNumber(-1);
  }

  return {
    normal,
    distance: rayDistance,
    point,
  };
};
