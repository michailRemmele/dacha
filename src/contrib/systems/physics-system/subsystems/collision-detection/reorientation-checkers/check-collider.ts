import type { Collider } from '../../../../../components';
import type { OrientationData } from '../types';

export const checkCollider = (
  collider: Collider,
  colliderOld: OrientationData['collider'],
): boolean => {
  if (collider.shape.type !== colliderOld.type) {
    return true;
  }

  if (collider.layer !== colliderOld.layer) {
    return true;
  }

  if (
    collider.offset.x !== colliderOld.offsetX ||
    collider.offset.y !== colliderOld.offsetY
  ) {
    return true;
  }

  if (collider.shape.type === 'box') {
    return (
      collider.shape.size.x !== colliderOld.sizeX ||
      collider.shape.size.y !== colliderOld.sizeY
    );
  }

  if (collider.shape.type === 'circle') {
    return collider.shape.radius !== colliderOld.radius;
  }

  if (collider.shape.type === 'segment') {
    return (
      collider.shape.point1.x !== colliderOld.point1X ||
      collider.shape.point1.y !== colliderOld.point1Y ||
      collider.shape.point2.x !== colliderOld.point2X ||
      collider.shape.point2.y !== colliderOld.point2Y
    );
  }

  return (
    collider.shape.point1.x !== colliderOld.point1X ||
    collider.shape.point1.y !== colliderOld.point1Y ||
    collider.shape.point2.x !== colliderOld.point2X ||
    collider.shape.point2.y !== colliderOld.point2Y ||
    collider.shape.radius !== colliderOld.radius
  );
};
