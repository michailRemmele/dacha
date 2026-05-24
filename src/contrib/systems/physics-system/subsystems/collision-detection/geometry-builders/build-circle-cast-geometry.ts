import type { CircleCastGeometry } from '../types';
import type { CircleCastParams } from '../../../types';

export function buildCircleCastGeometry(
  shapeCast: CircleCastParams,
): CircleCastGeometry {
  return {
    center: shapeCast.shape.center,
    origin: shapeCast.shape.center,
    radius: shapeCast.shape.radius,
    direction: shapeCast.direction.normalize(),
    maxDistance: shapeCast.maxDistance,
  };
}
