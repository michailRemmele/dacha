import type { WidgetSchema } from '../../../../types/widget-schema'

import { KeyboardControlWidget } from './view'

export const keyboardControl: WidgetSchema = {
  title: 'components.keyboardControl.title',
  view: KeyboardControlWidget,
  getInitial: () => ({
    inputEventBindings: [],
  }),
}
