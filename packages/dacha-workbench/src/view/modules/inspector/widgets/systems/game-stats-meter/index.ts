import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const gameStatsMeter: WidgetSchema = {
  fields: [
    {
      name: 'frequency',
      type: 'number',
      initialValue: 1,
    },
  ],
};
