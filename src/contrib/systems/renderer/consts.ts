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
  bottomRight: [1, 1],
  bottomLeft: [-1, 1],
  topLeft: [-1, -1],
  topRight: [1, -1],
};
