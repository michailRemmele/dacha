import type { Collider, Transform } from '../../../../../components';
import type { CircleCastGeometry } from '../types';
import type { CircleCastParams, CastActorParams } from '../../../types';
import { buildCircleGeometry } from './build-circle-geometry';

export function buildCircleCastGeometry(
  castParams: CircleCastParams,
): CircleCastGeometry;
export function buildCircleCastGeometry(
  collider: Collider,
  transform: Transform,
  castParams: CastActorParams,
): CircleCastGeometry;
export function buildCircleCastGeometry(
  castParamsOrCollider: CircleCastParams | Collider,
  transform?: Transform,
  castParams?: CastActorParams,
): CircleCastGeometry {
  const params = castParams ?? (castParamsOrCollider as CircleCastParams);

  const circle =
    transform !== undefined
      ? buildCircleGeometry(
          castParamsOrCollider as Collider,
          transform,
          castParams,
        )
      : buildCircleGeometry(castParamsOrCollider as CircleCastParams);

  return {
    ...circle,
    origin: circle.center,
    direction: params.direction.clone().normalize(),
    maxDistance: params.maxDistance,
  };
}
