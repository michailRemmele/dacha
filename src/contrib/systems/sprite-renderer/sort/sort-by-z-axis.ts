import { GameObject } from '../../../../engine/game-object';
import { Transform } from '../../../components/transform';

import type { SortFn } from './types';

export const sortByZAxis: SortFn = (a: GameObject, b: GameObject): number => {
  const aTransform = a.getComponent(Transform);
  const bTransform = b.getComponent(Transform);

  return aTransform.offsetZ - bTransform.offsetZ;
};
