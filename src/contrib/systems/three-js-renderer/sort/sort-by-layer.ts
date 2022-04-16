import type { Entity } from '../../../../engine/entity';
import type { Renderable } from '../../../components/renderable';
import { RENDERABLE_COMPONENT_NAME } from '../consts';

import type { SortFn } from './types';

export const createSortByLayer = (sortingLayers: Array<string>): SortFn => {
  const sortingLayer = sortingLayers.reduce((storage: Record<string, number>, layer, index) => {
    storage[layer] = index;
    return storage;
  }, {});

  return (a: Entity, b: Entity): number => {
    const aRenderable = a.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
    const bRenderable = b.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
    const aSortingLayerOrder = sortingLayer[aRenderable.sortingLayer];
    const bSortingLayerOrder = sortingLayer[bRenderable.sortingLayer];

    return aSortingLayerOrder - bSortingLayerOrder;
  };
};
