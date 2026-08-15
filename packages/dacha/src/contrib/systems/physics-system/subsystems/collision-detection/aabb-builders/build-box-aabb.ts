import type { AABB, Geometry, BoxGeometry } from '../types';

export const buildBoxAABB = (geometry: Geometry): AABB => {
  const { points } = geometry as BoxGeometry;

  return {
    min: {
      x: Math.min(points[0].x, points[1].x, points[2].x, points[3].x),
      y: Math.min(points[0].y, points[1].y, points[2].y, points[3].y),
    },
    max: {
      x: Math.max(points[0].x, points[1].x, points[2].x, points[3].x),
      y: Math.max(points[0].y, points[1].y, points[2].y, points[3].y),
    },
  };
};
