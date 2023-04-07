import type { WidgetSchema } from '../../../../types/widget-schema'

import { AnimatableWidget } from './view'

export const animatable: WidgetSchema = {
  title: 'components.animatable.title',
  view: AnimatableWidget,
  getInitialState: () => ({
    initialState: '',
    states: [],
  }),
}
