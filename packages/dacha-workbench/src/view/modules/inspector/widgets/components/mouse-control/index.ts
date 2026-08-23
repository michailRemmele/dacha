import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { MouseControlWidget } from './view'

export const mouseControl: WidgetSchema = {
  icon: 'HandPointUp',
  view: MouseControlWidget,
  fields: [
    { name: 'inputEventBindings', type: 'data', initialValue: [] },
  ],
}
