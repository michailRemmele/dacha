import type { ColliderContainer } from '../../../../../components';
import type { Coordinates } from '../types';

import { AABB } from './aabb';
import type { AABBBuilder } from './aabb-builder';

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

export class BoxAABBBuilder implements AABBBuilder {
  getAABB(container: ColliderContainer, coordinates: Coordinates): AABB {
    const minMax = coordinates.points.reduce((storage: NullableAABB, coordinate) => {
      const minX = storage.min.x;
      const minY = storage.min.y;
      const maxX = storage.max.x;
      const maxY = storage.max.y;

      storage.min.x = minX === null || coordinate.x < minX ? coordinate.x : minX;
      storage.min.y = minY === null || coordinate.y < minY ? coordinate.y : minY;
      storage.max.x = maxX === null || coordinate.x > maxX ? coordinate.x : maxX;
      storage.max.y = maxY === null || coordinate.y > maxY ? coordinate.y : maxY;

      return storage;
    }, { min: { x: null, y: null }, max: { x: null, y: null } }) as AABB;

    return new AABB({ x: minMax.min.x, y: minMax.min.y }, { x: minMax.max.x, y: minMax.max.y });
  }
}
