import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const cameraSystem: WidgetSchema = {
  icon: 'Camera',
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
      initialValue: 'root',
    },
  ],
};
