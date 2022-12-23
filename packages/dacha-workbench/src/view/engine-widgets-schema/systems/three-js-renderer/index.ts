import type { WidgetSchema } from '../../../../types/widget-schema'

export const threeJSRenderer: WidgetSchema = {
  title: 'systems.threeJSRenderer.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.threeJSRenderer.windowNodeId.title',
      type: 'string',
    },
    {
      name: 'backgroundColor',
      title: 'systems.threeJSRenderer.backgroundColor.title',
      type: 'string',
    },
    {
      name: 'sortingLayers',
      title: 'systems.threeJSRenderer.sortingLayers.title',
      type: 'multitext',
    },
    {
      name: 'scaleSensitivity',
      title: 'systems.threeJSRenderer.scaleSensitivity.title',
      type: 'number',
    },
  ],
}
