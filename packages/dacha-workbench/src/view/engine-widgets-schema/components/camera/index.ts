import type { WidgetSchema } from '../../../../types/widget-schema'

export const camera: WidgetSchema = {
  title: 'components.camera.title',
  fields: [
    {
      name: 'zoom',
      title: 'components.camera.zoom.title',
      type: 'number',
    },
  ],
  getInitial: () => ({
    zoom: 1,
  }),
}
