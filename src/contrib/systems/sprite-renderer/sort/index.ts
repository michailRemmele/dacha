import type { Actor } from '../../../../engine/actor';

import { SortFn } from './types';

export { createSortByLayer } from './sort-by-layer';
export { sortByXAxis } from './sort-by-x-axis';
export { sortByYAxis } from './sort-by-y-axis';
export { sortByZAxis } from './sort-by-z-axis';
export { sortByFit } from './sort-by-fit';

export const composeSort = (sortFns: Array<SortFn>): SortFn => (a: Actor, b: Actor) => {
  let result = 0;

  for (let i = 0; i < sortFns.length; i += 1) {
    result = sortFns[i](a, b);

    if (result !== 0) {
      return result;
    }
  }

  return result;
};

export type { SortFn };
