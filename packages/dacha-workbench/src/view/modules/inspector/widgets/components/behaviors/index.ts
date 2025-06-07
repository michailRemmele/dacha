import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { BehaviorsWidget } from './view'

export const behaviors: WidgetSchema = {
  view: BehaviorsWidget,
  getInitialState: () => ({
    list: [],
  }),
}
