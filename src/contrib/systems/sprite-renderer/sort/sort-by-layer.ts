import { Sprite } from '../../../components/sprite';
import type { GameObject } from '../../../../engine/game-object';

import type { SortFn } from './types';

export const createSortByLayer = (sortingLayers: Array<string>): SortFn => {
  const sortingLayer = sortingLayers.reduce((storage: Record<string, number>, layer, index) => {
    storage[layer] = index;
    return storage;
  }, {});

  return (a: GameObject, b: GameObject): number => {
    const aSprite = a.getComponent(Sprite);
    const bSprite = b.getComponent(Sprite);
    const aSortingLayerOrder = sortingLayer[aSprite.sortingLayer];
    const bSortingLayerOrder = sortingLayer[bSprite.sortingLayer];

    return aSortingLayerOrder - bSortingLayerOrder;
  };
};
