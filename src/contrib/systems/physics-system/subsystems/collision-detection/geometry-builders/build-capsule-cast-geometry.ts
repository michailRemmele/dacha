import type { CapsuleCastGeometry } from '../types';
import type { CapsuleCastParams } from '../../../types';
import { isZero, isDefinitelyPositive } from '../utils';

import { buildCapsuleGeometry } from './build-capsule-geometry';
import { buildBoxCastGeometry } from './build-box-cast-geometry';

export function buildCapsuleCastGeometry(
  shapeCast: CapsuleCastParams,
): CapsuleCastGeometry {
  const capsule = buildCapsuleGeometry(shapeCast);

  const boxSizeX = isZero(capsule.point2.x - capsule.point1.x)
    ? capsule.radius * 2
    : Math.abs(capsule.point2.x - capsule.point1.x);
  const boxSizeY = isZero(capsule.point2.y - capsule.point1.y)
    ? capsule.radius * 2
    : Math.abs(capsule.point2.y - capsule.point1.y);

  return {
    ...capsule,
    cap1: {
      center: capsule.point1,
      origin: capsule.point1,
      radius: capsule.radius,
      direction: shapeCast.direction,
      maxDistance: shapeCast.maxDistance,
    },
    cap2: {
      center: capsule.point2,
      origin: capsule.point2,
      radius: capsule.radius,
      direction: shapeCast.direction,
      maxDistance: shapeCast.maxDistance,
    },
    box:
      isDefinitelyPositive(boxSizeX) && isDefinitelyPositive(boxSizeY)
        ? buildBoxCastGeometry({
            shape: {
              type: 'box',
              center: capsule.center,
              size: { x: boxSizeX, y: boxSizeY },
            },
            direction: shapeCast.direction,
            maxDistance: shapeCast.maxDistance,
          })
        : null,
    origin: capsule.center,
    direction: shapeCast.direction.normalize(),
    maxDistance: shapeCast.maxDistance,
  };
}
