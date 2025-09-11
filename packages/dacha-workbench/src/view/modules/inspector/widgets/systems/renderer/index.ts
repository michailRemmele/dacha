import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const renderer: WidgetSchema = {
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
    },
    {
      name: 'backgroundColor',
      type: 'color',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
    backgroundColor: '#000',
  }),
};
