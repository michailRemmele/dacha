import type { Actor } from '../../../../engine/actor';

import { SortFn } from './types';

export { createSortByLayer } from './sort-by-layer';
export { sortByXAxis } from './sort-by-x-axis';
export { sortByYAxis } from './sort-by-y-axis';
export { sortByZAxis } from './sort-by-z-axis';

export const composeSort = (sortFns: SortFn[]): SortFn => (a: Actor, b: Actor) => {
  let result = 0;

  for (const sortFn of sortFns) {
    result = sortFn(a, b);

    if (result !== 0) {
      return result;
    }
  }

  return result;
};

export type { SortFn };
