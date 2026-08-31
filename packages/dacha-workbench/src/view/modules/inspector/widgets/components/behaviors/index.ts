import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { BehaviorsWidget } from './view';

export const behaviors: WidgetSchema = {
  icon: 'Thunderbolt',
  view: BehaviorsWidget,
  fields: [{ name: 'list', type: 'data', initialValue: [] }],
};
