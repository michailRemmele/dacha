import type { Collider, Transform } from '../../../../../components';
import type { CircleGeometry } from '../types';

export const buildCircleGeometry = (
  collider: Collider,
  transform: Transform,
): CircleGeometry => {
  const {
    world: { position, scale },
  } = transform;
  const { centerX, centerY, radius } = collider;

  const center = {
    x: centerX + position.x,
    y: centerY + position.y,
  };
  const scaledRadius = radius! * Math.max(scale.x, scale.y);

  return {
    center,
    radius: scaledRadius,
  };
};
