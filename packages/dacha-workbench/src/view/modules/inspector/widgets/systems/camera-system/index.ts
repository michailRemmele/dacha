import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const cameraSystem: WidgetSchema = {
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
  }),
}
