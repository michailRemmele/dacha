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
      name: 'linearSleepThreshold',
      type: 'number',
    },
    {
      name: 'angularSleepThreshold',
      type: 'number',
    },
    {
      name: 'sleepTimeThreshold',
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
    linearSleepThreshold: 1,
    angularSleepThreshold: 0.05,
    sleepTimeThreshold: 0.5,
    maxAllowedPenetration: 0.5,
    maxBiasVelocity: 60,
  }),
};
