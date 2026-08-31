import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const cameraSystem: WidgetSchema = {
  icon: 'Video',
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
      initialValue: 'root',
    },
  ],
};
