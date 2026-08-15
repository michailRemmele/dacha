import type { AABB, Geometry, CircleGeometry } from '../types';

export const buildCircleAABB = (geometry: Geometry): AABB => {
  const {
    radius,
    center: { x: centerX, y: centerY },
  } = geometry as CircleGeometry;

  return {
    min: { x: centerX - radius, y: centerY - radius },
    max: { x: centerX + radius, y: centerY + radius },
  };
};
