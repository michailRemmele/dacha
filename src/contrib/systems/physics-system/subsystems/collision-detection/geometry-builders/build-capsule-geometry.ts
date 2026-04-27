import { VectorOps, type Point } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { CapsuleGeometry } from '../types';

export function buildCapsuleGeometry(
  collider: Collider,
  transform: Transform,
): CapsuleGeometry {
  if (collider.shape.type !== 'capsule') {
    throw new Error(`Expected capsule collider, got ${collider.shape.type}.`);
  }

  const centerX = collider.offset.x + transform.world.position.x;
  const centerY = collider.offset.y + transform.world.position.y;

  const { point1, point2, radius } = collider.shape;

  const rotation = transform.world.rotation;
  const scaleX = transform.world.scale.x;
  const scaleY = transform.world.scale.y;
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
