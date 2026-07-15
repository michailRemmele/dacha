import {
  DEFAULT_FIXED_UPDATE_RATE,
  DEFAULT_MAX_FRAME_DELTA,
  DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
} from 'dacha';

import type { WidgetSchema } from '../../../../../types/widget-schema';

import { DEFAULT_LAYER_ID } from './physics/consts';
import { ORDER_OPTIONS } from './sorting/consts';

export const globalOptionsSchema: Record<string, WidgetSchema> = {
  physics: {
    fields: [
      { name: 'collisionLayers', type: 'data', initialValue: [] },
      {
        name: 'collisionMatrix',
        type: 'data',
        initialValue: { [DEFAULT_LAYER_ID]: { [DEFAULT_LAYER_ID]: true } },
      },
    ],
  },
  sorting: {
    fields: [
      { name: 'order', type: 'data', initialValue: ORDER_OPTIONS[0].value },
      { name: 'layers', type: 'data', initialValue: [] },
    ],
  },
  audioGroups: {
    fields: [{ name: 'groups', type: 'data', initialValue: [] }],
  },
  performance: {
    fields: [
      { name: 'maxFPS', type: 'data', initialValue: 0 },
      {
        name: 'fixedUpdateRate',
        type: 'data',
        initialValue: DEFAULT_FIXED_UPDATE_RATE,
      },
      {
        name: 'maxFrameDelta',
        type: 'data',
        initialValue: DEFAULT_MAX_FRAME_DELTA,
      },
      {
        name: 'maxFixedUpdatesPerFrame',
        type: 'data',
        initialValue: DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
      },
    ],
  },
};
