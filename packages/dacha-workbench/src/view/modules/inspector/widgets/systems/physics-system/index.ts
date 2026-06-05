import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const physicsSystem: WidgetSchema = {
  fields: [
    {
      name: 'gravityX',
      type: 'number',
    },
    {
      name: 'gravityY',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    gravityX: 0,
    gravityY: 100,
  }),
};
