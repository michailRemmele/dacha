import type {
  ColliderContainer,
  Transform,
} from '../../../../../components';
import type { CircleCollider } from '../../../../../components/collider-container/circle-collider';
import type { CircleGeometry } from '../types';

export const buildCircleGeometry = (
  container: ColliderContainer,
  transform: Transform,
): CircleGeometry => {
  const {
    offsetX,
    offsetY,
    scaleX,
    scaleY,
  } = transform;
  const { centerX, centerY, radius } = container.collider as CircleCollider;

  const center = {
    x: centerX + offsetX,
    y: centerY + offsetY,
  };
  const scaledRadius = radius * Math.max(scaleX, scaleY);

  return {
    center,
    radius: scaledRadius,
  };
};
