import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { ScriptWidget } from './view'

export const script: WidgetSchema = {
  title: 'components.script.title',
  view: ScriptWidget,
  getInitialState: () => ({
    name: '',
    options: {},
  }),
}
