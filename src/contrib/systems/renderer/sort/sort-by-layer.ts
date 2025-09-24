import { type ViewContainer } from 'pixi.js';

import type { SortFn } from './types';

export const createSortByLayer = (sortingLayers: string[]): SortFn => {
  const sortingLayer = sortingLayers.reduce(
    (storage: Record<string, number>, layer, index) => {
      storage[layer] = index;
      return storage;
    },
    {},
  );

  return (a: ViewContainer, b: ViewContainer): number => {
    const aComponent = a.__dacha.viewComponent;
    const bComponent = b.__dacha.viewComponent;
    const aSortingLayerOrder = sortingLayer[aComponent.sortingLayer];
    const bSortingLayerOrder = sortingLayer[bComponent.sortingLayer];

    return aSortingLayerOrder - bSortingLayerOrder;
  };
};
