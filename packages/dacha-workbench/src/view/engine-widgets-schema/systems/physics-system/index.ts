import type { WidgetSchema } from '../../../../types/widget-schema'

export const physicsSystem: WidgetSchema = {
  title: 'systems.physicsSystem.title',
  fields: [
    {
      name: 'gravitationalAcceleration',
      title: 'systems.physicsSystem.gravitationalAcceleration.title',
      type: 'number',
    },
  ],
  getInitial: () => ({
    gravitationalAcceleration: 100,
  }),
}
