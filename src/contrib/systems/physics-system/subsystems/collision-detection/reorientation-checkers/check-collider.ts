import type { Collider } from '../../../../../components';
import type { OrientationData } from '../types';

export const checkCollider = (
  collider: Collider,
  colliderOld: OrientationData['collider'],
): boolean => {
  if (collider.type !== colliderOld.type) {
    return true;
  }

  if (collider.layer !== colliderOld.layer) {
    return true;
  }

  if (
    collider.centerX !== colliderOld.centerX ||
    collider.centerY !== colliderOld.centerY
  ) {
    return true;
  }

  if (collider.type === 'box') {
    return (
      collider.sizeX !== colliderOld.sizeX ||
      collider.sizeY !== colliderOld.sizeY
    );
  }

  if (collider.type === 'circle') {
    return collider.radius !== colliderOld.radius;
  }

  return (
    collider.point1?.x !== colliderOld.point1?.x ||
    collider.point1?.y !== colliderOld.point1?.y ||
    collider.point2?.x !== colliderOld.point2?.x ||
    collider.point2?.y !== colliderOld.point2?.y
  );
};
