import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const collider: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        'box',
        'circle',
      ],
    },
    {
      name: 'sizeX',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'box',
      },
    },
    {
      name: 'sizeY',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'box',
      },
    },
    {
      name: 'radius',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'circle',
      },
    },
    {
      name: 'centerX',
      type: 'number',
    },
    {
      name: 'centerY',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    type: 'box',
    sizeX: 1,
    sizeY: 1,
    centerX: 0,
    centerY: 0,
  }),
}
