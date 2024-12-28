import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const cameraSystem: WidgetSchema = {
  title: 'systems.cameraSystem.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.cameraSystem.windowNodeId.title',
      type: 'string',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
  }),
}
