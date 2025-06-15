import type { Collider } from '../../../../../components';
import type { OrientationData } from '../types';

export const checkCollider = (
  collider: Collider,
  colliderOld: OrientationData['collider'],
): boolean => {
  if (collider.type !== colliderOld.type) {
    return true;
  }

  if (collider.type === 'box') {
    return collider.centerX !== colliderOld.centerX
      || collider.centerY !== colliderOld.centerY
      || collider.sizeX !== colliderOld.sizeX
      || collider.sizeY !== colliderOld.sizeY;
  }

  return collider.centerX !== colliderOld.centerX
    || collider.centerY !== colliderOld.centerY
    || collider.radius !== colliderOld.radius;
};
