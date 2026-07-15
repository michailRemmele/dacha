import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const rigidBody: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      initialValue: 'static',
      options: ['dynamic', 'static', 'kinematic'],
    },
    {
      name: 'mass',
      type: 'number',
      initialValue: 1,
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'gravityScale',
      type: 'number',
      initialValue: 1,
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'linearDamping',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'angularDamping',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'lockRotation',
      type: 'boolean',
      initialValue: false,
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'restitution',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'friction',
      type: 'number',
      initialValue: 0.6,
    },
    {
      name: 'oneWay',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'oneWayNormalX',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'oneWay',
        value: true,
      },
    },
    {
      name: 'oneWayNormalY',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'oneWay',
        value: true,
      },
    },
    {
      name: 'disabled',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
