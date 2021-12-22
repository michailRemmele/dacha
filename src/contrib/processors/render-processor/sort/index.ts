import type { GameObject } from '../../../../engine/gameObject';

import { Sorter, SortFn } from './types';

export { LayerSorter } from './layer-sorter';
export { XAxisSorter } from './x-axis-sorter';
export { YAxisSorter } from './y-axis-sorter';
export { ZAxisSorter } from './z-axis-sorter';

export const composeSort = (sorters: Array<Sorter>): SortFn => (a: GameObject, b: GameObject) => {
  let result = 0;

  for (let i = 0; i < sorters.length; i += 1) {
    result = sorters[i].sort(a, b);

    if (result !== 0) {
      return result;
    }
  }

  return result;
};

export { SortFn };
