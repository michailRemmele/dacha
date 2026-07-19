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
    {
      name: 'solverIterations',
      type: 'number',
    },
    {
      name: 'maxAllowedPenetration',
      type: 'number',
    },
    {
      name: 'maxBiasVelocity',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    gravityX: 0,
    gravityY: 980,
    solverIterations: 8,
    maxAllowedPenetration: 0.5,
    maxBiasVelocity: 60,
  }),
};
