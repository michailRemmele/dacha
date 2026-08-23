import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { AnimatableWidget } from './view'

export const animatable: WidgetSchema = {
  icon: 'Sliders',
  view: AnimatableWidget,
  fields: [
    { name: 'initialState', type: 'data', initialValue: '' },
    { name: 'states', type: 'data', initialValue: [] },
  ],
}
