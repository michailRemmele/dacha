import type { Entity } from '../../../../engine/entity';
import type { Transform } from '../../../components/transform';
import { TRANSFORM_COMPONENT_NAME } from '../consts';

import type { SortFn } from './types';

export const sortByZAxis: SortFn = (a: Entity, b: Entity): number => {
  const aTransform = a.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
  const bTransform = b.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;

  return aTransform.offsetZ - bTransform.offsetZ;
};
