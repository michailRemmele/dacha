import { Sprite } from '../../../components/sprite';
import type { GameObject } from '../../../../engine/game-object';

import type { SortFn } from './types';

export const sortByFit: SortFn = (a: GameObject, b: GameObject): number => {
  const aSprite = a.getComponent(Sprite);
  const bSprite = b.getComponent(Sprite);

  if (aSprite.fit > bSprite.fit) {
    return 1;
  }

  if (aSprite.fit < bSprite.fit) {
    return -1;
  }

  return 0;
};
