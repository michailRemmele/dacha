import type { WidgetSchema } from '../../../../types/widget-schema'

export const camera: WidgetSchema = {
  fields: [
    {
      name: 'zoom',
      title: 'components.camera.zoom.title',
      type: 'number',
    },
  ],
}
