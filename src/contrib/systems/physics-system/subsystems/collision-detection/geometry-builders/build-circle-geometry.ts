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
  let centerX: number;
  let centerY: number;
  let radius: number;
  let positionX: number;
  let positionY: number;
  let scaleX: number;
  let scaleY: number;

  if (transform !== undefined) {
    const collider = colliderOrOverlap as Collider;
    centerX = collider.centerX;
    centerY = collider.centerY;
    radius = collider.radius!;
    positionX = transform.world.position.x;
    positionY = transform.world.position.y;
    scaleX = transform.world.scale.x;
    scaleY = transform.world.scale.y;
  } else {
    const overlap = colliderOrOverlap as OverlapCircleParams;
    centerX = 0;
    centerY = 0;
    radius = overlap.radius;
    positionX = overlap.center.x;
    positionY = overlap.center.y;
    scaleX = 1;
    scaleY = 1;
  }

  const center = {
    x: centerX + positionX,
    y: centerY + positionY,
  };
  const scaledRadius = radius! * Math.max(scaleX, scaleY);

  return {
    center,
    radius: scaledRadius,
  };
}
