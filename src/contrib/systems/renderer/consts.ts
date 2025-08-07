import { type BLEND_MODES } from 'pixi.js';

import { type BlendingMode } from '../../components/sprite';
import { type SortingOrder } from './types';

export const BLEND_MODE_MAPPING: Record<BlendingMode, BLEND_MODES> = {
  normal: 'normal',
  addition: 'add',
  substract: 'subtract',
  multiply: 'multiply',
};

export const SORTING_ORDER_MAPPING: Record<SortingOrder, [number, number]> = {
  'bottom right': [1, 1],
  'bottom left': [-1, 1],
  'top left': [-1, -1],
  'top right': [1, -1],
};
