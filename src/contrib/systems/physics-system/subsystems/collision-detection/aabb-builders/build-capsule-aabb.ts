import type { AABB, CapsuleGeometry, Geometry } from '../types';

export const buildCapsuleAABB = (geometry: Geometry): AABB => {
  const { point1, point2, radius } = geometry as CapsuleGeometry;

  return {
    min: {
      x: Math.min(point1.x, point2.x) - radius,
      y: Math.min(point1.y, point2.y) - radius,
    },
    max: {
      x: Math.max(point1.x, point2.x) + radius,
      y: Math.max(point1.y, point2.y) + radius,
    },
  };
};
