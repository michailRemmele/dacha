import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { RendererWidget } from './view';

export const renderer: WidgetSchema = {
  view: RendererWidget,
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
      initialValue: 'root',
    },
    {
      name: 'backgroundColor',
      type: 'color',
      initialValue: '#000',
    },
    {
      name: 'filterEffects',
      type: 'data',
      initialValue: [],
    },
  ],
};
