import type { AABB, BoxCastGeometry, Geometry } from '../types';

export const buildBoxCastAABB = (params: Geometry): AABB => {
  const { points, direction, maxDistance } = params as BoxCastGeometry;
  const endPoints = points.map((point) => ({
    x: point.x + direction.x * maxDistance,
    y: point.y + direction.y * maxDistance,
  }));
  const castPoints = [...points, ...endPoints];

  return {
    min: {
      x: Math.min(...castPoints.map((point) => point.x)),
      y: Math.min(...castPoints.map((point) => point.y)),
    },
    max: {
      x: Math.max(...castPoints.map((point) => point.x)),
      y: Math.max(...castPoints.map((point) => point.y)),
    },
  };
};
