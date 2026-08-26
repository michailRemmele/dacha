import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const characterBody: WidgetSchema = {
  icon: 'PersonFill',
  fields: [
    {
      name: 'motionMode',
      type: 'select',
      initialValue: 'surface',
      options: ['surface', 'free'],
    },
    {
      name: 'upDirection',
      type: 'vector',
      initialValue: { x: 0, y: -1 },
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'skinWidth',
      type: 'number',
      initialValue: 0.1,
    },
    {
      name: 'maxSlopeAngle',
      type: 'number',
      initialValue: 45,
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'maxSlides',
      type: 'number',
      initialValue: 4,
    },
    {
      name: 'maxRecoveries',
      type: 'number',
      initialValue: 3,
    },
    {
      name: 'groundSnapDistance',
      type: 'number',
      initialValue: 1,
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'disabled',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
