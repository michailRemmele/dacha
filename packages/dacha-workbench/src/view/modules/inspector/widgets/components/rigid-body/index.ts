import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const rigidBody: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['dynamic', 'static', 'kinematic'],
    },
    {
      name: 'mass',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'gravityScale',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'linearDamping',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
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
    oneWay: false,
    disabled: false,
  }),
};
