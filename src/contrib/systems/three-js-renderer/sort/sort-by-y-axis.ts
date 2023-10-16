import { Renderable } from '../../../components/renderable';
import { Transform } from '../../../components/transform';
import type { GameObject } from '../../../../engine/game-object';

import type { SortFn } from './types';

export const sortByYAxis: SortFn = (a: GameObject, b: GameObject): number => {
  const aRenderable = a.getComponent(Renderable);
  const bRenderable = b.getComponent(Renderable);
  const aTransform = a.getComponent(Transform);
  const bTransform = b.getComponent(Transform);

  const aOffsetY = aTransform.offsetY
    + aRenderable.sortCenter[1]
    + ((aTransform.scaleY * aRenderable.height) / 2);
  const bOffsetY = bTransform.offsetY
    + bRenderable.sortCenter[1]
    + ((bTransform.scaleY * bRenderable.height) / 2);

  return aOffsetY - bOffsetY;
};
