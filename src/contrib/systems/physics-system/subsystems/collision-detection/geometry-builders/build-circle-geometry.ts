import type {
  Collider,
  Transform,
} from '../../../../../components';
import type { CircleGeometry } from '../types';

export const buildCircleGeometry = (
  collider: Collider,
  transform: Transform,
): CircleGeometry => {
  const {
    offsetX,
    offsetY,
    scaleX,
    scaleY,
  } = transform;
  const { centerX, centerY, radius } = collider;

  const center = {
    x: centerX + offsetX,
    y: centerY + offsetY,
  };
  const scaledRadius = radius! * Math.max(scaleX, scaleY);

  return {
    center,
    radius: scaledRadius,
  };
};
