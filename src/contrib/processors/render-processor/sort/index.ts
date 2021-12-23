import type { GameObject } from '../../../../engine/gameObject';

import { SortFn } from './types';

export { createSortByLayer } from './layer-sorter';
export { sortByXAxis } from './x-axis-sorter';
export { sortByYAxis } from './y-axis-sorter';
export { sortByZAxis } from './z-axis-sorter';

export const composeSort = (sortFns: Array<SortFn>): SortFn => (a: GameObject, b: GameObject) => {
  let result = 0;

  for (let i = 0; i < sortFns.length; i += 1) {
    result = sortFns[i](a, b);

    if (result !== 0) {
      return result;
    }
  }

  return result;
};

export { SortFn };
