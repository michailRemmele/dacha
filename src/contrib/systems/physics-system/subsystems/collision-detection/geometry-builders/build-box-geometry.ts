import { VectorOps } from '../../../../../../engine/math-lib';
import type {
  Collider,
  Transform,
} from '../../../../../components';
import type { BoxGeometry } from '../types';

export const buildBoxGeometry = (
  collider: Collider,
  transform: Transform,
): BoxGeometry => {
  const {
    offsetX,
    offsetY,
    scaleX,
    scaleY,
    rotation,
  } = transform;
  let { centerX, centerY } = collider;
  const { sizeX, sizeY } = collider;

  const x1 = -(sizeX! / 2);
  const x2 = (sizeX! / 2);
  const y1 = -(sizeY! / 2);
  const y2 = (sizeY! / 2);

  const angle = (rotation * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  centerX += offsetX;
  centerY += offsetY;

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
};
