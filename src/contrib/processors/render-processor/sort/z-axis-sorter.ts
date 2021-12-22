import type { GameObject } from '../../../../engine/gameObject';
import type { Transform } from '../../../components/transform';
import { TRANSFORM_COMPONENT_NAME } from '../consts';

import type { Sorter } from './types';

export class ZAxisSorter implements Sorter {
  sort(a: GameObject, b: GameObject): number {
    const aTransform = a.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
    const bTransform = b.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;

    return aTransform.offsetZ - bTransform.offsetZ;
  }
}
