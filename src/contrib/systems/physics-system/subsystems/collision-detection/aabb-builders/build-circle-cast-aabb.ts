import type { AABB, Geometry, CircleCastGeometry } from '../types';

export const buildCircleCastAABB = (params: Geometry): AABB => {
  const { center, radius, direction, maxDistance } =
    params as CircleCastGeometry;

  const endX = center.x + direction.x * maxDistance;
  const endY = center.y + direction.y * maxDistance;

  return {
    min: {
      x: Math.min(center.x, endX) - radius,
      y: Math.min(center.y, endY) - radius,
    },
    max: {
      x: Math.max(center.x, endX) + radius,
      y: Math.max(center.y, endY) + radius,
    },
  };
};
