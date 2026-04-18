import { VectorOps, type Point } from '../../../../../../engine/math-lib';
import type { Collider, Transform } from '../../../../../components';
import type { SegmentGeometry } from '../types';

export function buildSegmentGeometry(
  collider: Collider,
  transform: Transform,
): SegmentGeometry {
  const centerX = collider.centerX + transform.world.position.x;
  const centerY = collider.centerY + transform.world.position.y;
  const point1X = collider.point1?.x ?? 0;
  const point1Y = collider.point1?.y ?? 0;
  const point2X = collider.point2?.x ?? 0;
  const point2Y = collider.point2?.y ?? 0;
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

  const point1 = buildPoint(point1X, point1Y);
  const point2 = buildPoint(point2X, point2Y);

  return {
    center: {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
    },
    point1,
    point2,
    normal: VectorOps.getNormal(point1.x, point2.x, point1.y, point2.y),
  };
}
