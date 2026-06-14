import type { Collider, Transform } from '../../../../../components';
import type { BoxCastGeometry } from '../types';
import type { BoxCastParams, CastActorParams } from '../../../types';
import { buildBoxGeometry } from './build-box-geometry';

export function buildBoxCastGeometry(
  castParams: BoxCastParams,
): BoxCastGeometry;
export function buildBoxCastGeometry(
  collider: Collider,
  transform: Transform,
  castParams: CastActorParams,
): BoxCastGeometry;
export function buildBoxCastGeometry(
  castParamsOrCollider: BoxCastParams | Collider,
  transform?: Transform,
  castParams?: CastActorParams,
): BoxCastGeometry {
  const params = castParams ?? (castParamsOrCollider as BoxCastParams);

  const box =
    transform !== undefined
      ? buildBoxGeometry(
          castParamsOrCollider as Collider,
          transform,
          castParams,
        )
      : buildBoxGeometry(castParamsOrCollider as BoxCastParams);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of box.points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  return {
    ...box,
    origin: box.center,
    direction: params.direction.clone().normalize(),
    maxDistance: params.maxDistance,
    halfExtents: {
      x: (maxX - minX) / 2,
      y: (maxY - minY) / 2,
    },
  };
}
