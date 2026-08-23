import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { SortingWidget } from './view';
import { ORDER_OPTIONS } from './consts';

export const sorting: WidgetSchema = {
  title: 'globalOptions.sorting.title',
  icon: 'BarsAscendingAlignLeft',
  view: SortingWidget,
  fields: [
    { name: 'order', type: 'data', initialValue: ORDER_OPTIONS[0].value },
    { name: 'layers', type: 'data', initialValue: [] },
  ],
};
