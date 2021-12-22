import type { GameObject } from '../../../../engine/gameObject';
import type { Renderable } from '../../../components/renderable';
import { RENDERABLE_COMPONENT_NAME } from '../consts';

import type { Sorter } from './types';

export class LayerSorter implements Sorter {
  private sortingLayer: Record<string, number>;

  constructor(sortingLayers: Array<string>) {
    this.sortingLayer = sortingLayers.reduce((storage: Record<string, number>, layer, index) => {
      storage[layer] = index;
      return storage;
    }, {});
  }

  sort(a: GameObject, b: GameObject): number {
    const aRenderable = a.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
    const bRenderable = b.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
    const aSortingLayerOrder = this.sortingLayer[aRenderable.sortingLayer];
    const bSortingLayerOrder = this.sortingLayer[bRenderable.sortingLayer];

    return aSortingLayerOrder - bSortingLayerOrder;
  }
}
