import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const characterBody: WidgetSchema = {
  fields: [
    {
      name: 'upDirectionX',
      type: 'number',
    },
    {
      name: 'upDirectionY',
      type: 'number',
    },
    {
      name: 'skinWidth',
      type: 'number',
    },
    {
      name: 'maxSlopeAngle',
      type: 'number',
    },
    {
      name: 'maxSlides',
      type: 'number',
    },
    {
      name: 'groundProbeDistance',
      type: 'number',
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    upDirectionX: 0,
    upDirectionY: -1,
    skinWidth: 0.1,
    maxSlopeAngle: 45,
    maxSlides: 4,
    groundProbeDistance: 1,
    disabled: false,
  }),
};
