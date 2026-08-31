import type { WidgetSchema } from '../../../../../../types/widget-schema';

export const transform: WidgetSchema = {
  icon: 'ArrowsExpand',
  fields: [
    {
      name: 'offset',
      type: 'vector',
      initialValue: { x: 0, y: 0 },
    },
    {
      name: 'rotation',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'scale',
      type: 'vector',
      initialValue: { x: 1, y: 1 },
    },
  ],
};
