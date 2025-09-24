import { type ViewContainer } from 'pixi.js';

import { SortFn } from './types';

export { createSortByLayer } from './sort-by-layer';
export { sortByXAxis } from './sort-by-x-axis';
export { sortByYAxis } from './sort-by-y-axis';

export const composeSort =
  (sortFns: SortFn[]): SortFn =>
  (a: ViewContainer, b: ViewContainer) => {
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
