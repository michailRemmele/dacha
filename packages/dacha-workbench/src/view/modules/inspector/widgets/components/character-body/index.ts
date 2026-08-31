import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const characterBody: WidgetSchema = {
  icon: 'PersonFill',
  sections: {
    motion: { defaultOpen: true },
  },
  fields: [
    {
      name: 'motionMode',
      type: 'select',
      initialValue: 'surface',
      section: 'motion',
      options: ['surface', 'free'],
    },
    {
      name: 'upDirection',
      type: 'vector',
      initialValue: { x: 0, y: -1 },
      section: 'motion',
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'maxSlopeAngle',
      type: 'number',
      initialValue: 45,
      section: 'motion',
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'groundSnapDistance',
      type: 'number',
      initialValue: 1,
      section: 'motion',
      dependency: {
        name: 'motionMode',
        value: 'surface',
      },
    },
    {
      name: 'skinWidth',
      type: 'number',
      initialValue: 0.1,
      section: 'collision',
    },
    {
      name: 'maxSlides',
      type: 'number',
      initialValue: 4,
      section: 'collision',
    },
    {
      name: 'maxRecoveries',
      type: 'number',
      initialValue: 3,
      section: 'collision',
    },
    {
      name: 'disabled',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
