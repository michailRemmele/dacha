import { VectorOps } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { ActorGeometryParams, BoxGeometry } from '../types';
import type { OverlapBoxParams, BoxCastParams } from '../../../types';

export function buildBoxGeometry(
  queryParams: OverlapBoxParams | BoxCastParams,
): BoxGeometry;
export function buildBoxGeometry(
  collider: Collider,
  transform: Transform,
  params?: ActorGeometryParams,
): BoxGeometry;
export function buildBoxGeometry(
  colliderOrQueryParams: Collider | OverlapBoxParams | BoxCastParams,
  transform?: Transform,
  params?: ActorGeometryParams,
): BoxGeometry {
  let offsetX: number;
  let offsetY: number;
  let sizeX: number;
  let sizeY: number;
  let positionX: number;
  let positionY: number;
  let rotation: number;
  let scaleX: number;
  let scaleY: number;

  if (transform !== undefined) {
    const collider = colliderOrQueryParams as Collider;

    if (collider.shape.type !== 'box') {
      throw new Error(`Expected box collider, got ${collider.shape.type}.`);
    }

    offsetX = collider.offset.x;
    offsetY = collider.offset.y;
    sizeX = collider.shape.size.x;
    sizeY = collider.shape.size.y;
    positionX = transform.world.position.x + (params?.offset?.x ?? 0);
    positionY = transform.world.position.y + (params?.offset?.y ?? 0);
    rotation = transform.world.rotation;
    scaleX = transform.world.scale.x;
    scaleY = transform.world.scale.y;
  } else {
    const queryShape = (colliderOrQueryParams as OverlapBoxParams).shape;
    offsetX = 0;
    offsetY = 0;
    sizeX = queryShape.size.x;
    sizeY = queryShape.size.y;
    positionX = queryShape.center.x;
    positionY = queryShape.center.y;
    rotation = queryShape.rotation ?? 0;
    scaleX = 1;
    scaleY = 1;
  }

  const x1 = -(sizeX / 2);
  const x2 = sizeX / 2;
  const y1 = -(sizeY / 2);
  const y2 = sizeY / 2;

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const center = VectorOps.rotatePoint(
    {
      x: offsetX * scaleX,
      y: offsetY * scaleY,
    },
    rotation,
  );
  center.x += positionX;
  center.y += positionY;

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

    point.x = rotatedX + center.x;
    point.y = rotatedY + center.y;
  });

  const edges = points.map((point1, index, array) => {
    const point2 = array[(index + 1) % array.length];
    const normal = VectorOps.getNormal(point1.x, point2.x, point1.y, point2.y);
    const offset = VectorOps.dotProduct(point1, normal);

    if (VectorOps.dotProduct(center, normal) - offset > 0) {
      normal.multiplyNumber(-1);
    }

    return {
      point1,
      point2,
      normal,
    };
  });

  return {
    center,
    points,
    edges,
  };
}
