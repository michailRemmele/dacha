import type { Actor } from '../../../../../../engine/actor';
import { Collider, Transform } from '../../../../../components';
import type { OrientationData } from '../types';

const getColliderData = (collider: Collider): OrientationData['collider'] => {
  const data: OrientationData['collider'] = {
    type: collider.shape.type,
    layer: collider.layer,
    offsetX: collider.offset.x,
    offsetY: collider.offset.y,
  };

  switch (collider.shape.type) {
    case 'box':
      data.sizeX = collider.shape.size.x;
      data.sizeY = collider.shape.size.y;
      break;
    case 'circle':
      data.radius = collider.shape.radius;
      break;
    case 'segment':
      data.point1X = collider.shape.point1.x;
      data.point1Y = collider.shape.point1.y;
      data.point2X = collider.shape.point2.x;
      data.point2Y = collider.shape.point2.y;
      break;
    case 'capsule':
      data.radius = collider.shape.radius;
      data.point1X = collider.shape.point1.x;
      data.point1Y = collider.shape.point1.y;
      data.point2X = collider.shape.point2.x;
      data.point2Y = collider.shape.point2.y;
  }

  return data;
};

export const getOrientationData = (actor: Actor): OrientationData => {
  const transform = actor.getComponent(Transform);
  const collider = actor.getComponent(Collider);

  return {
    transform: {
      positionX: transform.world.position.x,
      positionY: transform.world.position.y,
      rotation: transform.world.rotation,
      scaleX: transform.world.scale.x,
      scaleY: transform.world.scale.y,
    },
    collider: getColliderData(collider),
  };
};
