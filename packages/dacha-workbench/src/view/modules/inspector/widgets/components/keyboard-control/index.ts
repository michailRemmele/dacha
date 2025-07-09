import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { KeyboardControlWidget } from './view'

export const keyboardControl: WidgetSchema = {
  view: KeyboardControlWidget,
  getInitialState: () => ({
    inputEventBindings: [],
  }),
}
