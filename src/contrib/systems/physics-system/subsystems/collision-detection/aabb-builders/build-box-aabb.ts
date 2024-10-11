import type { ColliderContainer } from '../../../../../components';
import type { AABB, Geometry } from '../types';

interface NullableAABB {
  min: {
    x: number | null
    y: number | null
  }
  max: {
    x: number | null
    y: number | null
  }
}

export const buildBoxAABB = (container: ColliderContainer, geometry: Geometry): AABB => {
  const minMax = geometry.points.reduce((storage: NullableAABB, point) => {
    const minX = storage.min.x;
    const minY = storage.min.y;
    const maxX = storage.max.x;
    const maxY = storage.max.y;

    storage.min.x = minX === null || point.x < minX ? point.x : minX;
    storage.min.y = minY === null || point.y < minY ? point.y : minY;
    storage.max.x = maxX === null || point.x > maxX ? point.x : maxX;
    storage.max.y = maxY === null || point.y > maxY ? point.y : maxY;

    return storage;
  }, { min: { x: null, y: null }, max: { x: null, y: null } }) as AABB;

  return {
    min: { x: minMax.min.x, y: minMax.min.y },
    max: { x: minMax.max.x, y: minMax.max.y },
  };
};
