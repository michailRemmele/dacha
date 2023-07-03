import type { ColliderContainer } from '../../../../../components';
import type { CircleCollider } from '../../../../../components/collider-container/circle-collider';
import type { Coordinates } from '../types';

import { AABB } from './aabb';
import type { AABBBuilder } from './aabb-builder';

export class CircleAABBBuilder implements AABBBuilder {
  getAABB(container: ColliderContainer, coordinates: Coordinates): AABB {
    const { radius } = container.collider as CircleCollider;
    const { x: centerX, y: centerY } = coordinates.center;

    const minX = centerX - radius;
    const maxX = centerX + radius;
    const minY = centerY - radius;
    const maxY = centerY + radius;

    return new AABB({ x: minX, y: minY }, { x: maxX, y: maxY });
  }
}
