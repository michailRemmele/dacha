import type { WidgetSchema } from '../../../../types/widget-schema'

export const gameStatsMeter: WidgetSchema = {
  title: 'systems.gameStatsMeter.title',
  fields: [
    {
      name: 'frequency',
      title: 'systems.gameStatsMeter.frequency.title',
      type: 'number',
    },
  ],
}
