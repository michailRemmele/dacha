import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { BehaviorsWidget } from './view'

export const behaviors: WidgetSchema = {
  title: 'components.behaviors.title',
  view: BehaviorsWidget,
  getInitialState: () => ({
    list: [],
  }),
}
