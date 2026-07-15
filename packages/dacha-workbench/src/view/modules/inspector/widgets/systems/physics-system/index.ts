import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const physicsSystem: WidgetSchema = {
  fields: [
    {
      name: 'gravityX',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'gravityY',
      type: 'number',
      initialValue: 980,
    },
    {
      name: 'solverIterations',
      type: 'number',
      initialValue: 8,
    },
    {
      name: 'maxAllowedPenetration',
      type: 'number',
      initialValue: 0.5,
    },
    {
      name: 'maxBiasVelocity',
      type: 'number',
      initialValue: 60,
    },
  ],
};
