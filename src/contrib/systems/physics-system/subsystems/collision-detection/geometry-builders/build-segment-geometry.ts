import { VectorOps, type Point } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { SegmentGeometry } from '../types';

export function buildSegmentGeometry(
  collider: Collider,
  transform: Transform,
): SegmentGeometry {
  if (collider.shape.type !== 'segment') {
    throw new Error(`Expected segment collider, got ${collider.shape.type}.`);
  }

  const rotation = transform.world.rotation;
  const scaleX = transform.world.scale.x;
  const scaleY = transform.world.scale.y;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const center = VectorOps.rotatePoint(
    {
      x: collider.offset.x * scaleX,
      y: collider.offset.y * scaleY,
    },
    rotation,
  );
  center.x += transform.world.position.x;
  center.y += transform.world.position.y;

  const buildPoint = (x: number, y: number): Point => {
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    return {
      x: scaledX * cos - scaledY * sin + center.x,
      y: scaledX * sin + scaledY * cos + center.y,
    };
  };

  const geometryPoint1 = buildPoint(
    collider.shape.point1.x,
    collider.shape.point1.y,
  );
  const geometryPoint2 = buildPoint(
    collider.shape.point2.x,
    collider.shape.point2.y,
  );

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
  };
}
