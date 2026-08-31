import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const gameStatsMeter: WidgetSchema = {
  icon: 'Speedometer',
  fields: [
    {
      name: 'frequency',
      type: 'number',
      initialValue: 1,
    },
  ],
};
