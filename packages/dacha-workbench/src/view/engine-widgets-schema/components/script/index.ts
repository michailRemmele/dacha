import type { WidgetSchema } from '../../../../types/widget-schema'

import { ScriptWidget } from './view'

export const script: WidgetSchema = {
  title: 'components.script.title',
  fields: [
    {
      name: 'name',
      title: 'components.script.name.title',
      type: 'select',
      referenceId: 'names',
    },
  ],
  view: ScriptWidget,
}
