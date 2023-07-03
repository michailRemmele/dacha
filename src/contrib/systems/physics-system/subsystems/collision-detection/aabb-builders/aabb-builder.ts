import type { ColliderContainer } from '../../../../../components';
import type { Coordinates } from '../types';

import type { AABB } from './aabb';

export interface AABBBuilder {
  getAABB(collider: ColliderContainer, coordinates: Coordinates): AABB
}
