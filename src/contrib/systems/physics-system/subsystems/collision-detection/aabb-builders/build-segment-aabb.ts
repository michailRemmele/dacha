import type { AABB, Geometry, SegmentGeometry } from '../types';
import { INTERSECTION_EPSILON } from '../intersection-checkers/utils';

export const buildSegmentAABB = (geometry: Geometry): AABB => {
  const { point1, point2 } = geometry as SegmentGeometry;

  return {
    min: {
      x: Math.min(point1.x, point2.x) - INTERSECTION_EPSILON,
      y: Math.min(point1.y, point2.y) - INTERSECTION_EPSILON,
    },
    max: {
      x: Math.max(point1.x, point2.x) + INTERSECTION_EPSILON,
      y: Math.max(point1.y, point2.y) + INTERSECTION_EPSILON,
    },
  };
};
