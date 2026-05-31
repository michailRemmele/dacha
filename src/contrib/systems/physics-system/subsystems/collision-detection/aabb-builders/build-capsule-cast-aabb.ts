import type { AABB, CapsuleCastGeometry, Geometry } from '../types';

export const buildCapsuleCastAABB = (params: Geometry): AABB => {
  const { point1, point2, radius, direction, maxDistance } =
    params as CapsuleCastGeometry;

  const endPoint1 = {
    x: point1.x + direction.x * maxDistance,
    y: point1.y + direction.y * maxDistance,
  };
  const endPoint2 = {
    x: point2.x + direction.x * maxDistance,
    y: point2.y + direction.y * maxDistance,
  };

  return {
    min: {
      x: Math.min(point1.x, point2.x, endPoint1.x, endPoint2.x) - radius,
      y: Math.min(point1.y, point2.y, endPoint1.y, endPoint2.y) - radius,
    },
    max: {
      x: Math.max(point1.x, point2.x, endPoint1.x, endPoint2.x) + radius,
      y: Math.max(point1.y, point2.y, endPoint1.y, endPoint2.y) + radius,
    },
  };
};
