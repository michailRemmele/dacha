import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const light: WidgetSchema = {
  title: 'components.light.title',
  fields: [
    {
      name: 'type',
      title: 'components.light.type.title',
      type: 'select',
      referenceId: 'types',
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
      type: 'string',
    },
    {
      name: 'options.intensity',
      title: 'components.light.intensity.title',
      type: 'number',
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'components.light.types.ambient.title',
          value: 'ambient',
        },
        {
          title: 'components.light.types.point.title',
          value: 'point',
        },
      ],
    },
  },
  getInitialState: () => ({
    type: 'point',
    options: {
      color: '#fff',
      intensity: 1,
      distance: 10,
    },
  }),
}
