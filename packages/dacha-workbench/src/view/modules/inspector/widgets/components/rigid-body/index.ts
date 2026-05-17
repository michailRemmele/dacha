import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const rigidBody: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['dynamic', 'static'],
    },
    {
      name: 'mass',
      type: 'number',
    },
    {
      name: 'gravityScale',
      type: 'number',
    },
    {
      name: 'linearDamping',
      type: 'number',
    },
    {
      name: 'oneWay',
      type: 'boolean',
    },
    {
      name: 'oneWayNormalX',
      type: 'number',
      dependency: {
        name: 'oneWay',
        value: true,
      },
    },
    {
      name: 'oneWayNormalY',
      type: 'number',
      dependency: {
        name: 'oneWay',
        value: true,
      },
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    type: 'static',
    mass: 1,
    gravityScale: 0,
    linearDamping: 0,
    oneWay: false,
    disabled: false,
  }),
};
