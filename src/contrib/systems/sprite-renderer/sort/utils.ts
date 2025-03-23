import type { SortingLayer } from '../types';

export const parseSortingLayers = (sortingLayers?: SortingLayer[]): Array<string> => {
  if (Array.isArray(sortingLayers)) {
    return sortingLayers.map((layer) => String(layer.name));
  }

  return [];
};
