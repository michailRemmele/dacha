import { Renderable } from '../../../components/renderable';
import type { GameObject } from '../../../../engine/game-object';

import type { SortFn } from './types';

export const sortByFit: SortFn = (a: GameObject, b: GameObject): number => {
  const aRenderable = a.getComponent(Renderable);
  const bRenderable = b.getComponent(Renderable);

  if (aRenderable.fit > bRenderable.fit) {
    return 1;
  }

  if (aRenderable.fit < bRenderable.fit) {
    return -1;
  }

  return 0;
};
