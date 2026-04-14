import { VectorOps } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { BoxGeometry } from '../types';
import type { OverlapBoxParams } from '../../../types';

export function buildBoxGeometry(overlap: OverlapBoxParams): BoxGeometry;
export function buildBoxGeometry(
  collider: Collider,
  transform: Transform,
): BoxGeometry;
export function buildBoxGeometry(
  colliderOrOverlap: Collider | OverlapBoxParams,
  transform?: Transform,
): BoxGeometry {
  let centerX: number;
  let centerY: number;
  let sizeX: number;
  let sizeY: number;
  let positionX: number;
  let positionY: number;
  let rotation: number;
  let scaleX: number;
  let scaleY: number;

  if (transform !== undefined) {
    const collider = colliderOrOverlap as Collider;
    centerX = collider.centerX;
    centerY = collider.centerY;
    sizeX = collider.sizeX!;
    sizeY = collider.sizeY!;
    positionX = transform.world.position.x;
    positionY = transform.world.position.y;
    rotation = transform.world.rotation;
    scaleX = transform.world.scale.x;
    scaleY = transform.world.scale.y;
  } else {
    const overlap = colliderOrOverlap as OverlapBoxParams;
    centerX = 0;
    centerY = 0;
    sizeX = overlap.size.x;
    sizeY = overlap.size.y;
    positionX = overlap.center.x;
    positionY = overlap.center.y;
    rotation = overlap.rotation ?? 0;
    scaleX = 1;
    scaleY = 1;
  }

  const x1 = -(sizeX / 2);
  const x2 = sizeX / 2;
  const y1 = -(sizeY / 2);
  const y2 = sizeY / 2;

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  centerX += positionX;
  centerY += positionY;

  const points = [
    { x: x1, y: y1 },
    { x: x1, y: y2 },
    { x: x2, y: y2 },
    { x: x2, y: y1 },
  ];

  points.forEach((point) => {
    const { x, y } = point;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    const rotatedX = scaledX * cos - scaledY * sin;
    const rotatedY = scaledX * sin + scaledY * cos;

    point.x = rotatedX + centerX;
    point.y = rotatedY + centerY;
  });

  const edges = points.map((point1, index, array) => {
    const point2 = array[(index + 1) % array.length];

    return {
      point1,
      point2,
      normal: VectorOps.getNormal(point1.x, point2.x, point1.y, point2.y),
    };
  });

  return {
    center: {
      x: centerX,
      y: centerY,
    },
    points,
    edges,
  };
}
