import { Renderable } from '../../../components/renderable';
import type { GameObject } from '../../../../engine/game-object';

import type { SortFn } from './types';

export const createSortByLayer = (sortingLayers: Array<string>): SortFn => {
  const sortingLayer = sortingLayers.reduce((storage: Record<string, number>, layer, index) => {
    storage[layer] = index;
    return storage;
  }, {});

  return (a: GameObject, b: GameObject): number => {
    const aRenderable = a.getComponent(Renderable);
    const bRenderable = b.getComponent(Renderable);
    const aSortingLayerOrder = sortingLayer[aRenderable.sortingLayer];
    const bSortingLayerOrder = sortingLayer[bRenderable.sortingLayer];

    return aSortingLayerOrder - bSortingLayerOrder;
  };
};
