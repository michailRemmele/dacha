import type { WidgetSchema } from '../../../../../../types/widget-schema';
import { MARKERS } from '../../../../../../consts/markers';

export const editorMarker: WidgetSchema = {
  fields: [
    {
      name: 'name',
      type: 'select',
      options: MARKERS,
    },
    {
      name: 'color',
      type: 'color',
    },
  ],
  getInitialState: () => ({
    name: 'point',
    color: '#fff',
  }),
};
