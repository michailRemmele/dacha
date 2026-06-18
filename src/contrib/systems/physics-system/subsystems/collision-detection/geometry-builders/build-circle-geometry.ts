import { VectorOps } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { ActorGeometryParams, CircleGeometry } from '../types';
import type { OverlapCircleParams, CircleCastParams } from '../../../types';

export function buildCircleGeometry(
  queryParams: OverlapCircleParams | CircleCastParams,
): CircleGeometry;
export function buildCircleGeometry(
  collider: Collider,
  transform: Transform,
  params?: ActorGeometryParams,
): CircleGeometry;
export function buildCircleGeometry(
  colliderOrQueryParams: Collider | OverlapCircleParams | CircleCastParams,
  transform?: Transform,
  params?: ActorGeometryParams,
): CircleGeometry {
  let offsetX: number;
  let offsetY: number;
  let radius: number;
  let positionX: number;
  let positionY: number;
  let rotation: number;
  let scaleX: number;
  let scaleY: number;

  if (transform !== undefined) {
    const collider = colliderOrQueryParams as Collider;

    if (collider.shape.type !== 'circle') {
      throw new Error(`Expected circle collider, got ${collider.shape.type}.`);
    }

    offsetX = collider.offset.x;
    offsetY = collider.offset.y;
    radius = collider.shape.radius;
    positionX = transform.world.position.x + (params?.offset?.x ?? 0);
    positionY = transform.world.position.y + (params?.offset?.y ?? 0);
    rotation = transform.world.rotation;
    scaleX = transform.world.scale.x;
    scaleY = transform.world.scale.y;
  } else {
    const queryShape = (colliderOrQueryParams as OverlapCircleParams).shape;
    offsetX = 0;
    offsetY = 0;
    radius = queryShape.radius;
    positionX = queryShape.center.x;
    positionY = queryShape.center.y;
    rotation = 0;
    scaleX = 1;
    scaleY = 1;
  }

  const center = VectorOps.rotatePoint(
    {
      x: offsetX * scaleX,
      y: offsetY * scaleY,
    },
    rotation,
  );
  center.x += positionX;
  center.y += positionY;

  const scaledRadius = radius! * Math.max(scaleX, scaleY);

  return {
    center,
    radius: scaledRadius,
  };
}
