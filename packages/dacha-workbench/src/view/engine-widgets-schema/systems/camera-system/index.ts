import type { WidgetSchema } from '../../../../types/widget-schema'

import { CameraSystemWidget } from './view'

export const cameraSystem: WidgetSchema = {
  title: 'systems.cameraSystem.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.cameraSystem.windowNodeId.title',
      type: 'string',
    },
    {
      name: 'initialCamera',
      title: 'systems.cameraSystem.initialCamera.title',
      type: 'select',
      referenceId: 'gameObjects',
    },
  ],
  view: CameraSystemWidget,
  getInitialState: () => ({
    windowNodeId: '',
    initialCamera: '',
  }),
}
