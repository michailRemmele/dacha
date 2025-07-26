import { Actor } from '../../../../engine/actor';
import { Transform } from '../../../components/transform';

import type { SortFn } from './types';

export const sortByZAxis: SortFn = (a: Actor, b: Actor): number => {
  const aTransform = a.getComponent(Transform);
  const bTransform = b.getComponent(Transform);

  return aTransform.offsetZ - bTransform.offsetZ;
};
