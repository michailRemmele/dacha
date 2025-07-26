import { Sprite } from '../../../components/sprite';
import type { Actor } from '../../../../engine/actor';

import type { SortFn } from './types';

export const createSortByLayer = (sortingLayers: string[]): SortFn => {
  const sortingLayer = sortingLayers.reduce(
    (storage: Record<string, number>, layer, index) => {
      storage[layer] = index;
      return storage;
    },
    {},
  );

  return (a: Actor, b: Actor): number => {
    const aSprite = a.getComponent(Sprite);
    const bSprite = b.getComponent(Sprite);
    const aSortingLayerOrder = sortingLayer[aSprite.sortingLayer];
    const bSortingLayerOrder = sortingLayer[bSprite.sortingLayer];

    return aSortingLayerOrder - bSortingLayerOrder;
  };
};
