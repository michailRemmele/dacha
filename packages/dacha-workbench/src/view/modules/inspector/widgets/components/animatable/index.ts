import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { AnimatableWidget } from './view'

export const animatable: WidgetSchema = {
  view: AnimatableWidget,
  getInitialState: () => ({
    initialState: '',
    states: [],
  }),
}
