import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const interpolation: WidgetSchema = {
  fields: [
    {
      name: 'mode',
      type: 'select',
      options: ['interpolate', 'extrapolate'],
    },
    {
      name: 'snapThreshold',
      type: 'number',
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    mode: 'interpolate',
    snapThreshold: 0,
    disabled: false,
  }),
};
