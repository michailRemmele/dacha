import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const physicsSystem: WidgetSchema = {
  fields: [
    {
      name: 'gravity',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    gravity: 100,
  }),
}
