import type { ColliderContainer } from '../../../../../components';
import type { BoxCollider } from '../../../../../components/collider-container/box-collider';
import type { CircleCollider } from '../../../../../components/collider-container/circle-collider';
import type { OrientationData } from '../types';

export const checkCollider = (
  colliderContainer: ColliderContainer,
  colliderOld: OrientationData['collider'],
): boolean => {
  if (colliderContainer.type !== colliderOld.type) {
    return true;
  }

  if (colliderContainer.type === 'boxCollider') {
    const collider = colliderContainer.collider as BoxCollider;
    return collider.centerX !== colliderOld.centerX
      || collider.centerY !== colliderOld.centerY
      || collider.sizeX !== colliderOld.sizeX
      || collider.sizeY !== colliderOld.sizeY;
  }

  const collider = colliderContainer.collider as CircleCollider;
  return collider.centerX !== colliderOld.centerX
    || collider.centerY !== colliderOld.centerY
    || collider.radius !== colliderOld.radius;
};
