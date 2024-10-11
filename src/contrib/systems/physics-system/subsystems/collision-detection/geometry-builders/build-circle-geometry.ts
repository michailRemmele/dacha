import type {
  ColliderContainer,
  Transform,
} from '../../../../../components';
import type { Geometry } from '../types';

export const buildCircleGeometry = (
  container: ColliderContainer,
  transform: Transform,
): Geometry => {
  const { offsetX, offsetY } = transform;
  const { centerX, centerY } = container.collider;

  return {
    center: {
      x: centerX + offsetX,
      y: centerY + offsetY,
    },
    points: [],
    edges: [],
  };
};
