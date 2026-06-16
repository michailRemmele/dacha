import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const characterBody: WidgetSchema = {
  fields: [
    {
      name: 'motionMode',
      type: 'select',
      options: ['surface', 'free'],
    },
    {
      name: 'upDirectionX',
      type: 'number',
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'upDirectionY',
      type: 'number',
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'skinWidth',
      type: 'number',
    },
    {
      name: 'maxSlopeAngle',
      type: 'number',
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'maxSlides',
      type: 'number',
    },
    {
      name: 'maxRecoveries',
      type: 'number',
    },
    {
      name: 'groundSnapDistance',
      type: 'number',
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    motionMode: 'surface',
    upDirectionX: 0,
    upDirectionY: -1,
    skinWidth: 0.1,
    maxSlopeAngle: 45,
    maxSlides: 4,
    maxRecoveries: 3,
    groundSnapDistance: 1,
    disabled: false,
  }),
};
