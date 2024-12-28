import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const camera: WidgetSchema = {
  title: 'components.camera.title',
  fields: [
    {
      name: 'zoom',
      title: 'components.camera.zoom.title',
      type: 'number',
    },
    {
      name: 'current',
      title: 'components.camera.current.title',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    zoom: 1,
    current: false,
  }),
}
