import type { CapsuleCastGeometry } from '../types';
import type { CapsuleCastParams } from '../../../types';
import { buildCapsuleGeometry } from './build-capsule-geometry';

export function buildCapsuleCastGeometry(
  shapeCast: CapsuleCastParams,
): CapsuleCastGeometry {
  const capsule = buildCapsuleGeometry(shapeCast);

  return {
    ...capsule,
    origin: capsule.center,
    direction: shapeCast.direction.normalize(),
    maxDistance: shapeCast.maxDistance,
  };
}
