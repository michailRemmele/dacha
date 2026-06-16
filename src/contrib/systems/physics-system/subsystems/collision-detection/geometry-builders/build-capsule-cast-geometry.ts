import type { Collider, Transform } from '../../../../../components';
import type { CapsuleCastGeometry } from '../types';
import type { CapsuleCastParams, CastActorParams } from '../../../types';
import { isZero, isDefinitelyPositive } from '../utils';

import { buildCapsuleGeometry } from './build-capsule-geometry';
import { buildBoxCastGeometry } from './build-box-cast-geometry';

export function buildCapsuleCastGeometry(
  castParams: CapsuleCastParams,
): CapsuleCastGeometry;
export function buildCapsuleCastGeometry(
  collider: Collider,
  transform: Transform,
  castParams: CastActorParams,
): CapsuleCastGeometry;
export function buildCapsuleCastGeometry(
  castParamsOrCollider: CapsuleCastParams | Collider,
  transform?: Transform,
  castParams?: CastActorParams,
): CapsuleCastGeometry {
  const params = castParams ?? (castParamsOrCollider as CapsuleCastParams);

  const direction = params.direction.clone().normalize();

  const capsule =
    transform !== undefined
      ? buildCapsuleGeometry(
          castParamsOrCollider as Collider,
          transform,
          castParams,
        )
      : buildCapsuleGeometry(castParamsOrCollider as CapsuleCastParams);

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
      direction,
      maxDistance: params.maxDistance,
    },
    cap2: {
      center: capsule.point2,
      origin: capsule.point2,
      radius: capsule.radius,
      direction,
      maxDistance: params.maxDistance,
    },
    box:
      isDefinitelyPositive(boxSizeX) && isDefinitelyPositive(boxSizeY)
        ? buildBoxCastGeometry({
            shape: {
              type: 'box',
              center: capsule.center,
              size: { x: boxSizeX, y: boxSizeY },
            },
            direction,
            maxDistance: params.maxDistance,
          })
        : null,
    origin: capsule.center,
    direction,
    maxDistance: params.maxDistance,
  };
}
