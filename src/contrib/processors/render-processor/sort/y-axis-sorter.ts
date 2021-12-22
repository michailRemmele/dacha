import type { GameObject } from '../../../../engine/gameObject';
import type { Renderable } from '../../../components/renderable';
import type { Transform } from '../../../components/transform';
import { TRANSFORM_COMPONENT_NAME, RENDERABLE_COMPONENT_NAME } from '../consts';

import type { Sorter } from './types';

export class YAxisSorter implements Sorter {
  sort(a: GameObject, b: GameObject): number {
    const aRenderable = a.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
    const bRenderable = b.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
    const aTransform = a.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
    const bTransform = b.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;

    const aOffsetY = aTransform.offsetY + ((aTransform.scaleY * aRenderable.height) / 2);
    const bOffsetY = bTransform.offsetY + ((bTransform.scaleY * bRenderable.height) / 2);

    return aOffsetY - bOffsetY;
  }
}
