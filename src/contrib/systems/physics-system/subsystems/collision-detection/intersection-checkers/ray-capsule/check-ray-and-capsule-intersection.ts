import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import type {
  CapsuleGeometry,
  Intersection,
  Point,
  Proxy,
  RayGeometry,
} from '../../types';
import { INTERSECTION_EPSILON } from '../../constants';

const chooseNearest = (
  nearest: Intersection | false,
  candidate: Intersection | false,
): Intersection | false => {
  if (!candidate) {
    return nearest;
  }

  if (!nearest || candidate.distance! < nearest.distance!) {
    return candidate;
  }

  return nearest;
};

const checkRayAndCap = (
  ray: RayGeometry,
  center: Point,
  radius: number,
): Intersection | false => {
  const offsetX = ray.origin.x - center.x;
  const offsetY = ray.origin.y - center.y;
  const b = offsetX * ray.direction.x + offsetY * ray.direction.y;
  const c = offsetX ** 2 + offsetY ** 2 - radius ** 2;

  if (c > INTERSECTION_EPSILON && b > 0) {
    return false;
  }

  const discriminant = b ** 2 - c;

  if (discriminant < -INTERSECTION_EPSILON) {
    return false;
  }

  const hitDistance = Math.max(0, -b - Math.sqrt(Math.max(0, discriminant)));

  if (hitDistance > ray.maxDistance + INTERSECTION_EPSILON) {
    return false;
  }

  const hitPoint = {
    x: ray.origin.x + ray.direction.x * hitDistance,
    y: ray.origin.y + ray.direction.y * hitDistance,
  };
  const normal = new Vector2(hitPoint.x - center.x, hitPoint.y - center.y);

  if (normal.magnitude === 0) {
    normal.x = -ray.direction.x;
    normal.y = -ray.direction.y;
  } else {
    normal.normalize();
  }

  return {
    normal,
    distance: hitDistance,
    penetration: 0,
    contactPoints: [hitPoint],
  };
};

/**
 * Checks one straight side of the capsule against the ray.
 *
 * The capsule side is treated as an offset segment. Solving the ray/segment
 * crossing gives a distance along the ray and a normalized position along the
 * side segment; both must be within their finite ranges. The side normal is
 * flipped when necessary so hits always report a normal opposing the ray.
 */
const checkRayAndSide = (
  ray: RayGeometry,
  point1: Point,
  point2: Point,
  sideNormal: Vector2,
): Intersection | false => {
  const segmentDirection = {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  };
  const delta = {
    x: point1.x - ray.origin.x,
    y: point1.y - ray.origin.y,
  };
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
  const normal = sideNormal.clone();

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

/**
 * Checks a ray against a capsule.
 *
 * The capsule boundary is tested as two circular caps plus the two parallel
 * side segments offset from the capsule axis by its radius. Cap hits use the
 * ray/circle quadratic equation, and side hits solve the usual ray/segment
 * parametric intersection. The nearest valid boundary hit within
 * `maxDistance` is returned.
 */
export const checkRayAndCapsuleIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const ray = arg1.geometry as RayGeometry;
  const capsule = arg2.geometry as CapsuleGeometry;
  const sideNormal = capsule.normal;
  const side1Point1 = {
    x: capsule.point1.x + sideNormal.x * capsule.radius,
    y: capsule.point1.y + sideNormal.y * capsule.radius,
  };
  const side1Point2 = {
    x: capsule.point2.x + sideNormal.x * capsule.radius,
    y: capsule.point2.y + sideNormal.y * capsule.radius,
  };
  const side2Point1 = {
    x: capsule.point1.x - sideNormal.x * capsule.radius,
    y: capsule.point1.y - sideNormal.y * capsule.radius,
  };
  const side2Point2 = {
    x: capsule.point2.x - sideNormal.x * capsule.radius,
    y: capsule.point2.y - sideNormal.y * capsule.radius,
  };
  let nearest = checkRayAndCap(ray, capsule.point1, capsule.radius);

  nearest = chooseNearest(
    nearest,
    checkRayAndCap(ray, capsule.point2, capsule.radius),
  );
  nearest = chooseNearest(
    nearest,
    checkRayAndSide(ray, side1Point1, side1Point2, sideNormal),
  );
  nearest = chooseNearest(
    nearest,
    checkRayAndSide(
      ray,
      side2Point1,
      side2Point2,
      sideNormal.clone().multiplyNumber(-1),
    ),
  );

  return nearest;
};
