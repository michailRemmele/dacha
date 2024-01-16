import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { ScriptBundleWidget } from './view'

export const scriptBundle: WidgetSchema = {
  title: 'components.scriptBundle.title',
  view: ScriptBundleWidget,
  getInitialState: () => ({
    name: '',
    options: {},
  }),
}
