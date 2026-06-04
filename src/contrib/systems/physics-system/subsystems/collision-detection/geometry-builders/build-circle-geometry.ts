import { VectorOps } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { CircleGeometry } from '../types';
import type { OverlapCircleParams } from '../../../types';

export function buildCircleGeometry(
  overlap: OverlapCircleParams,
): CircleGeometry;
export function buildCircleGeometry(
  collider: Collider,
  transform: Transform,
): CircleGeometry;
export function buildCircleGeometry(
  colliderOrOverlap: Collider | OverlapCircleParams,
  transform?: Transform,
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
    const collider = colliderOrOverlap as Collider;

    if (collider.shape.type !== 'circle') {
      throw new Error(`Expected circle collider, got ${collider.shape.type}.`);
    }

    offsetX = collider.offset.x;
    offsetY = collider.offset.y;
    radius = collider.shape.radius;
    positionX = transform.world.position.x;
    positionY = transform.world.position.y;
    rotation = transform.world.rotation;
    scaleX = transform.world.scale.x;
    scaleY = transform.world.scale.y;
  } else {
    const overlap = (colliderOrOverlap as OverlapCircleParams).shape;
    offsetX = 0;
    offsetY = 0;
    radius = overlap.radius;
    positionX = overlap.center.x;
    positionY = overlap.center.y;
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
