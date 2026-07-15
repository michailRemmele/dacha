import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const keyboardInputSystem: WidgetSchema = {
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
