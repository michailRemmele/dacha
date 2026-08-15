import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const mouseInputSystem: WidgetSchema = {
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
      initialValue: 'root',
      dependency: {
        name: 'useWindow',
        value: false,
      },
    },
    {
      name: 'useWindow',
      type: 'boolean',
      initialValue: true,
    },
  ],
};
