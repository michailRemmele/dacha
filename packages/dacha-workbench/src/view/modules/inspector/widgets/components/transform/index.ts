import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const transform: WidgetSchema = {
  fields: [
    {
      name: 'offsetX',
      type: 'number',
    },
    {
      name: 'offsetY',
      type: 'number',
    },
    {
      name: 'rotation',
      type: 'number',
    },
    {
      name: 'scaleX',
      type: 'number',
    },
    {
      name: 'scaleY',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  }),
}
