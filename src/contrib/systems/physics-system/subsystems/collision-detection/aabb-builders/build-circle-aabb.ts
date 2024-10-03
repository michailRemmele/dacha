import type { ColliderContainer } from '../../../../../components';
import type { CircleCollider } from '../../../../../components/collider-container/circle-collider';
import type { AABB, Geometry } from '../types';

export const buildCircleAABB = (container: ColliderContainer, geometry: Geometry): AABB => {
  const { radius } = container.collider as CircleCollider;
  const { x: centerX, y: centerY } = geometry.center;

  const minX = centerX - radius;
  const maxX = centerX + radius;
  const minY = centerY - radius;
  const maxY = centerY + radius;

  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY },
  };
};
