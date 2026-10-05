import type { GetFieldOptionsFn } from '../../../engine/decorators';
import type { SortingLayer } from './types';

const SORTING_LAYERS_PATH = [
  'globalOptions',
  'name:sorting',
  'options',
  'layers',
];

/**
 * Lists the sorting layer names from the project configuration, for the
 * `sortingLayer` field of drawable components.
 */
export const sortingLayerOptions: GetFieldOptionsFn = (getState) =>
  ((getState(SORTING_LAYERS_PATH) as SortingLayer[] | undefined) ?? []).map(
    (layer) => layer.name,
  );
