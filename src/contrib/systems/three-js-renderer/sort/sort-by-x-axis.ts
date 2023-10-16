import { Renderable } from '../../../components/renderable';
import { Transform } from '../../../components/transform';
import type { GameObject } from '../../../../engine/game-object';

import type { SortFn } from './types';

export const sortByXAxis: SortFn = (a: GameObject, b: GameObject): number => {
  const aRenderable = a.getComponent(Renderable);
  const bRenderable = b.getComponent(Renderable);
  const aTransform = a.getComponent(Transform);
  const bTransform = b.getComponent(Transform);

  const aOffsetX = aTransform.offsetX
    + aRenderable.sortCenter[0]
    + ((aTransform.scaleX * aRenderable.width) / 2);
  const bOffsetX = bTransform.offsetX
    + bRenderable.sortCenter[0]
    + ((bTransform.scaleX * bRenderable.width) / 2);

  return aOffsetX - bOffsetX;
};
