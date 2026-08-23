import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const interpolation: WidgetSchema = {
  icon: 'RectanglePulse',
  fields: [
    {
      name: 'mode',
      type: 'select',
      initialValue: 'interpolate',
      options: ['interpolate', 'extrapolate'],
    },
    {
      name: 'snapThreshold',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'disabled',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
