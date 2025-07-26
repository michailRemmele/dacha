import type { BLEND_MODES } from 'pixi.js';

import type { BlendingMode } from '../../components/sprite';

export const BLEND_MODE_MAPPING: Record<BlendingMode, BLEND_MODES> = {
  normal: 'normal',
  addition: 'add',
  substract: 'subtract',
  multiply: 'multiply',
};
