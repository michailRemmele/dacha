import { VectorOps, type Point } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { CapsuleGeometry } from '../types';
import type { OverlapCapsuleParams } from '../../../types';

export function buildCapsuleGeometry(
  overlap: OverlapCapsuleParams,
): CapsuleGeometry;
export function buildCapsuleGeometry(
  collider: Collider,
  transform: Transform,
): CapsuleGeometry;
export function buildCapsuleGeometry(
  colliderOrOverlap: Collider | OverlapCapsuleParams,
  transform?: Transform,
): CapsuleGeometry {
  let centerX: number;
  let centerY: number;
  let point1: Point;
  let point2: Point;
  let radius: number;
  let rotation: number;
  let scaleX: number;
  let scaleY: number;

  if (transform !== undefined) {
    const collider = colliderOrOverlap as Collider;

    if (collider.shape.type !== 'capsule') {
      throw new Error(`Expected capsule collider, got ${collider.shape.type}.`);
    }

    centerX = collider.offset.x + transform.world.position.x;
    centerY = collider.offset.y + transform.world.position.y;
    point1 = collider.shape.point1;
    point2 = collider.shape.point2;
    radius = collider.shape.radius;
    rotation = transform.world.rotation;
    scaleX = transform.world.scale.x;
    scaleY = transform.world.scale.y;
  } else {
    const overlap = (colliderOrOverlap as OverlapCapsuleParams).shape;
    centerX = 0;
    centerY = 0;
    point1 = overlap.point1;
    point2 = overlap.point2;
    radius = overlap.radius;
    rotation = overlap.rotation ?? 0;
    scaleX = 1;
    scaleY = 1;
  }

  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  const buildPoint = (x: number, y: number): Point => {
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    return {
      x: scaledX * cos - scaledY * sin + centerX,
      y: scaledX * sin + scaledY * cos + centerY,
    };
  };

  const geometryPoint1 = buildPoint(point1.x, point1.y);
  const geometryPoint2 = buildPoint(point2.x, point2.y);

  return {
    center: {
      x: (geometryPoint1.x + geometryPoint2.x) / 2,
      y: (geometryPoint1.y + geometryPoint2.y) / 2,
    },
    point1: geometryPoint1,
    point2: geometryPoint2,
    normal: VectorOps.getNormal(
      geometryPoint1.x,
      geometryPoint2.x,
      geometryPoint1.y,
      geometryPoint2.y,
    ),
    radius: radius * Math.max(scaleX, scaleY),
  };
}
