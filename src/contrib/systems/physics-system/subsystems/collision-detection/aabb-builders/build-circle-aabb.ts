import type { AABB, Geometry, CircleGeometry } from '../types';

export const buildCircleAABB = (geometry: Geometry): AABB => {
  const { radius } = geometry as CircleGeometry;
  const { x: centerX, y: centerY } = geometry.center;

  return {
    min: { x: centerX - radius, y: centerY - radius },
    max: { x: centerX + radius, y: centerY + radius },
  };
};
