import {
  DEFAULT_FIXED_UPDATE_RATE,
  DEFAULT_MAX_FRAME_DELTA,
  DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
} from 'dacha';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const performance: WidgetSchema = {
  title: 'globalOptions.performance.title',
  icon: 'Tachometer',
  fields: [
    {
      name: 'maxFPS',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'fixedUpdateRate',
      type: 'number',
      initialValue: DEFAULT_FIXED_UPDATE_RATE,
    },
    {
      name: 'maxFrameDelta',
      type: 'number',
      initialValue: DEFAULT_MAX_FRAME_DELTA,
    },
    {
      name: 'maxFixedUpdatesPerFrame',
      type: 'number',
      initialValue: DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
    },
  ],
};
