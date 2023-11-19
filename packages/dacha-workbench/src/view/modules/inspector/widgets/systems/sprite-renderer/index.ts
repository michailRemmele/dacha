import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const spriteRenderer: WidgetSchema = {
  title: 'systems.spriteRenderer.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.spriteRenderer.windowNodeId.title',
      type: 'string',
    },
    {
      name: 'backgroundColor',
      title: 'systems.spriteRenderer.backgroundColor.title',
      type: 'color',
    },
    {
      name: 'backgroundAlpha',
      title: 'systems.spriteRenderer.backgroundAlpha.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
    backgroundColor: '#000',
    backgroundAlpha: 1,
  }),
}
