import { type BLEND_MODES } from 'pixi.js';

import { type ComponentConstructor } from '../../../engine/component';
import { Sprite, type BlendingMode } from '../../components/sprite';
import { Shape } from '../../components/shape';
import { PixiView } from '../../components/pixi-view';
import { BitmapText } from '../../components/bitmap-text';
import { Mesh } from '../../components/mesh';

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

export const VIEW_COMPONENTS: ComponentConstructor[] = [
  Sprite,
  Shape,
  PixiView,
  BitmapText,
  Mesh,
];
