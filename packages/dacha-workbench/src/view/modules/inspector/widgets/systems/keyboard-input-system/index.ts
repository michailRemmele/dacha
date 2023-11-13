import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const keyboardInputSystem: WidgetSchema = {
  title: 'systems.keyboardInputSystem.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.keyboardInputSystem.windowNodeId.title',
      type: 'string',
      dependency: {
        name: 'useWindow',
        value: false,
      },
    },
    {
      name: 'useWindow',
      title: 'systems.keyboardInputSystem.useWindow.title',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    useWindow: true,
  }),
}
