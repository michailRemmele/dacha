import { VectorOps } from '../../../../../../engine/math-lib';
import type {
  ColliderContainer,
  Transform,
} from '../../../../../components';
import type { BoxCollider } from '../../../../../components/collider-container/box-collider';
import type { Geometry } from '../types';

export const buildBoxGeometry = (container: ColliderContainer, transform: Transform): Geometry => {
  const { offsetX, offsetY } = transform;
  let { centerX, centerY } = container.collider;
  const { sizeX, sizeY } = container.collider as BoxCollider;

  centerX += offsetX;
  centerY += offsetY;

  const x1 = -(sizeX / 2) + centerX;
  const x2 = (sizeX / 2) + centerX;
  const y1 = -(sizeY / 2) + centerY;
  const y2 = (sizeY / 2) + centerY;

  const points = [
    {
      x: x1,
      y: y1,
    },
    {
      x: x1,
      y: y2,
    },
    {
      x: x2,
      y: y2,
    },
    {
      x: x2,
      y: y1,
    },
  ];

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
