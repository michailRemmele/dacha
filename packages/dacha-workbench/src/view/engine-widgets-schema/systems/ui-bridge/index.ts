import type { WidgetSchema } from '../../../../types/widget-schema'

import { UIBridgeWidget } from './view'

export const uiBridge: WidgetSchema = {
  title: 'systems.uiBridge.title',
  fields: [
    {
      name: 'filterComponents',
      title: 'systems.uiBridge.filterComponents.title',
      type: 'multiselect',
      referenceId: 'components',
    },
  ],
  view: UIBridgeWidget,
  getInitial: () => ({
    filterComponents: [],
  }),
}
