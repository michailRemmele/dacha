import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const spriteRenderer: WidgetSchema = {
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
    },
    {
      name: 'backgroundColor',
      type: 'color',
    },
    {
      name: 'backgroundAlpha',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
    backgroundColor: '#000',
    backgroundAlpha: 1,
  }),
}
