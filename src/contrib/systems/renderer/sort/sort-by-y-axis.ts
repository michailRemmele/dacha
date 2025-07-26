import { Sprite } from '../../../components/sprite';
import { Transform } from '../../../components/transform';
import type { Actor } from '../../../../engine/actor';

import type { SortFn } from './types';

export const sortByYAxis: SortFn = (a: Actor, b: Actor): number => {
  const aSprite = a.getComponent(Sprite);
  const bSprite = b.getComponent(Sprite);
  const aTransform = a.getComponent(Transform);
  const bTransform = b.getComponent(Transform);

  const aOffsetY = aTransform.offsetY
    + aSprite.sortCenter[1]
    + ((aTransform.scaleY * aSprite.height) / 2);
  const bOffsetY = bTransform.offsetY
    + bSprite.sortCenter[1]
    + ((bTransform.scaleY * bSprite.height) / 2);

  return aOffsetY - bOffsetY;
};
