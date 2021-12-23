import type { GameObject } from '../../../../engine/gameObject';
import type { Renderable } from '../../../components/renderable';
import type { Transform } from '../../../components/transform';
import { TRANSFORM_COMPONENT_NAME, RENDERABLE_COMPONENT_NAME } from '../consts';

import type { SortFn } from './types';

export const sortByXAxis: SortFn = (a: GameObject, b: GameObject): number => {
  const aRenderable = a.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
  const bRenderable = b.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
  const aTransform = a.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
  const bTransform = b.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;

  const aOffsetX = aTransform.offsetX + ((aTransform.scaleX * aRenderable.width) / 2);
  const bOffsetX = bTransform.offsetX + ((bTransform.scaleX * bRenderable.width) / 2);

  return aOffsetX - bOffsetX;
};
