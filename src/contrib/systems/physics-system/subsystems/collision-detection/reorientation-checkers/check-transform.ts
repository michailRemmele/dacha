import type { Transform } from '../../../../../components';
import type { OrientationData } from '../types';

export const checkTransform = (
  transform: Transform,
  transformOld: OrientationData['transform'],
): boolean =>
  transform.world.position.x !== transformOld.positionX ||
  transform.world.position.y !== transformOld.positionY ||
  transform.world.rotation !== transformOld.rotation ||
  transform.world.scale.x !== transformOld.scaleX ||
  transform.world.scale.y !== transformOld.scaleY;
