import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const mouseInputSystem: WidgetSchema = {
  title: 'systems.mouseInputSystem.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.mouseInputSystem.windowNodeId.title',
      type: 'string',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
  }),
}
