import { Sprite } from '../../../components/sprite';
import { Transform } from '../../../components/transform';
import type { GameObject } from '../../../../engine/game-object';

import type { SortFn } from './types';

export const sortByXAxis: SortFn = (a: GameObject, b: GameObject): number => {
  const aSprite = a.getComponent(Sprite);
  const bSprite = b.getComponent(Sprite);
  const aTransform = a.getComponent(Transform);
  const bTransform = b.getComponent(Transform);

  const aOffsetX = aTransform.offsetX
    + aSprite.sortCenter[0]
    + ((aTransform.scaleX * aSprite.width) / 2);
  const bOffsetX = bTransform.offsetX
    + bSprite.sortCenter[0]
    + ((bTransform.scaleX * bSprite.width) / 2);

  return aOffsetX - bOffsetX;
};
