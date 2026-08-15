import type { WidgetSchema } from '../../../../../../types/widget-schema';
import { MARKERS } from '../../../../../../consts/markers';

export const editorMarker: WidgetSchema = {
  fields: [
    {
      name: 'name',
      type: 'select',
      initialValue: 'point',
      options: MARKERS,
    },
    {
      name: 'color',
      type: 'color',
      initialValue: '#fff',
    },
  ],
};
