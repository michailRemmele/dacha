export const parseSortingLayers = (sortingLayers: unknown): Array<string> => {
  if (Array.isArray(sortingLayers)) {
    return sortingLayers.map((layer) => String(layer));
  }

  return [];
};
