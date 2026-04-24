import { VectorOps } from '../../../../../../../engine/math-lib';
import type {
  Proxy,
  RayGeometry,
  SegmentGeometry,
  Intersection,
} from '../../types';
import { INTERSECTION_EPSILON } from '../utils';

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
export const checkRayAndSegmentIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const isSegmentFirst = 'point1' in arg1.geometry;
  const segment = (
    isSegmentFirst ? arg1.geometry : arg2.geometry
  ) as SegmentGeometry;
  const ray = (isSegmentFirst ? arg2.geometry : arg1.geometry) as RayGeometry;
  const segmentDirection = subtractPoints(segment.point2, segment.point1);
  const delta = subtractPoints(segment.point1, ray.origin);
  const denominator = VectorOps.crossProduct(ray.direction, segmentDirection);

  if (Math.abs(denominator) <= INTERSECTION_EPSILON) {
    return false;
  }

  const rayDistance =
    VectorOps.crossProduct(delta, segmentDirection) / denominator;
  const segmentDistance =
    VectorOps.crossProduct(delta, ray.direction) / denominator;

  if (
    rayDistance < -INTERSECTION_EPSILON ||
    rayDistance > ray.maxDistance + INTERSECTION_EPSILON ||
    segmentDistance < -INTERSECTION_EPSILON ||
    segmentDistance > 1 + INTERSECTION_EPSILON
  ) {
    return false;
  }

  const point = {
    x: ray.origin.x + ray.direction.x * rayDistance,
    y: ray.origin.y + ray.direction.y * rayDistance,
  };
  const normal = segment.normal.clone();

  if (
    normal.x * ray.direction.x + normal.y * ray.direction.y >
    INTERSECTION_EPSILON
  ) {
    normal.multiplyNumber(-1);
  }

  return {
    normal,
    distance: rayDistance,
    penetration: 0,
    contactPoints: [point],
  };
};
