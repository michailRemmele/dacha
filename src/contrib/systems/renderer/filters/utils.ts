import type { Filter } from 'pixi.js';

export const combineFilters = (
  parentFilters?: Filter[],
  ownFilters?: Filter[],
): Filter[] | undefined => {
  if (parentFilters && ownFilters) {
    return parentFilters.concat(ownFilters);
  }
  return parentFilters ?? ownFilters;
};
