import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { KeyboardControlWidget } from './view'

export const keyboardControl: WidgetSchema = {
  view: KeyboardControlWidget,
  fields: [
    { name: 'inputEventBindings', type: 'data', initialValue: [] },
  ],
}
