import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const camera: WidgetSchema = {
  fields: [
    {
      name: 'zoom',
      type: 'number',
      initialValue: 1,
    },
    {
      name: 'current',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
