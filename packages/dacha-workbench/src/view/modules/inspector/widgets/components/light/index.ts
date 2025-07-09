import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const light: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        'ambient',
        'point',
      ],
    },
    {
      name: 'options.distance',
      title: 'components.light.distance.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'point',
      },
    },
    {
      name: 'options.color',
      title: 'components.light.color.title',
      type: 'color',
    },
    {
      name: 'options.intensity',
      title: 'components.light.intensity.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    type: 'point',
    options: {
      color: '#fff',
      intensity: 1,
      distance: 10,
    },
  }),
}
