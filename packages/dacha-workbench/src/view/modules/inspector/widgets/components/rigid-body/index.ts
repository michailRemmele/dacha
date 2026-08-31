import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const rigidBody: WidgetSchema = {
  icon: 'WeightHanging',
  sections: {
    dynamics: { defaultOpen: true },
  },
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
      section: 'dynamics',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'gravityScale',
      type: 'number',
      initialValue: 1,
      section: 'dynamics',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'linearDamping',
      type: 'number',
      initialValue: 0,
      section: 'dynamics',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'angularDamping',
      type: 'number',
      initialValue: 0,
      section: 'dynamics',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'lockRotation',
      type: 'boolean',
      initialValue: false,
      section: 'dynamics',
      dependency: {
        name: 'type',
        value: 'dynamic',
      },
    },
    {
      name: 'restitution',
      type: 'number',
      initialValue: 0,
      section: 'material',
    },
    {
      name: 'friction',
      type: 'number',
      initialValue: 0.6,
      section: 'material',
    },
    {
      name: 'oneWay',
      type: 'boolean',
      initialValue: false,
      section: 'oneWay',
    },
    {
      name: 'oneWayNormal',
      type: 'vector',
      initialValue: { x: 0, y: 0 },
      section: 'oneWay',
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
