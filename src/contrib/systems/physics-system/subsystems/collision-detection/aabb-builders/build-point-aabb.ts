import type { AABB, Geometry, PointGeometry } from '../types';

export const buildPointAABB = (geometry: Geometry): AABB => {
  const { center } = geometry as PointGeometry;

  return {
    min: { ...center },
    max: { ...center },
  };
};
