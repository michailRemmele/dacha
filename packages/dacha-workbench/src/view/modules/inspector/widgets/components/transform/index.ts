import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const transform: WidgetSchema = {
  fields: [
    {
      name: 'offsetX',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'offsetY',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'rotation',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'scaleX',
      type: 'number',
      initialValue: 1,
    },
    {
      name: 'scaleY',
      type: 'number',
      initialValue: 1,
    },
  ],
};
