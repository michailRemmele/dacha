import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const camera: WidgetSchema = {
  fields: [
    {
      name: 'zoom',
      type: 'number',
    },
    {
      name: 'current',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    zoom: 1,
    current: false,
  }),
}
