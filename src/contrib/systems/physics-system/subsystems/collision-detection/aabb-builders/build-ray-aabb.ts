import type { AABB, Geometry, RayGeometry } from '../types';

export const buildRayAABB = (geometry: Geometry): AABB => {
  const { origin, direction, maxDistance } = geometry as RayGeometry;

  const endX = origin.x + direction.x * maxDistance;
  const endY = origin.y + direction.y * maxDistance;

  return {
    min: { x: Math.min(origin.x, endX), y: Math.min(origin.y, endY) },
    max: { x: Math.max(origin.x, endX), y: Math.max(origin.y, endY) },
  };
};
