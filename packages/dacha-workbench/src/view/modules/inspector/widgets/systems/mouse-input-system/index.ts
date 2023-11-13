import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const mouseInputSystem: WidgetSchema = {
  title: 'systems.mouseInputSystem.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.mouseInputSystem.windowNodeId.title',
      type: 'string',
      dependency: {
        name: 'useWindow',
        value: false,
      },
    },
    {
      name: 'useWindow',
      title: 'systems.mouseInputSystem.useWindow.title',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    useWindow: true,
  }),
}
