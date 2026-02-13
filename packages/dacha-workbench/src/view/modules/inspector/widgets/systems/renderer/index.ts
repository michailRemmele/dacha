import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { RendererWidget } from './view';

export const renderer: WidgetSchema = {
  view: RendererWidget,
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
    },
    {
      name: 'backgroundColor',
      type: 'color',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
    backgroundColor: '#000',
    filterEffects: [],
  }),
};
