import type { Transform } from '../../../../../components';
import type { OrientationData } from '../types';

export const checkTransform = (
  transform: Transform,
  transformOld: OrientationData['transform'],
): boolean => transform.offsetX !== transformOld.offsetX
  || transform.offsetY !== transformOld.offsetY
  || transform.rotation !== transformOld.rotation
  || transform.scaleX !== transformOld.scaleX
  || transform.scaleY !== transformOld.scaleY;
