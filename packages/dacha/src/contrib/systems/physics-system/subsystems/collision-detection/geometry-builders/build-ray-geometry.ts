import type { RayGeometry } from '../types';
import type { RaycastParams } from '../../../types';

export function buildRayGeometry(overlap: RaycastParams): RayGeometry {
  return {
    origin: overlap.origin,
    direction: overlap.direction.clone().normalize(),
    maxDistance: overlap.maxDistance,
  };
}
