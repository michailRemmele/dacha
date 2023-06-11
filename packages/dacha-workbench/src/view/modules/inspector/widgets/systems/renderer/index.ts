import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const renderer: WidgetSchema = {
  title: 'systems.renderer.title',
  fields: [
    {
      name: 'windowNodeId',
      title: 'systems.renderer.windowNodeId.title',
      type: 'string',
    },
    {
      name: 'backgroundColor',
      title: 'systems.renderer.backgroundColor.title',
      type: 'color',
    },
    {
      name: 'backgroundAlpha',
      title: 'systems.renderer.backgroundAlpha.title',
      type: 'number',
    },
    {
      name: 'sortingLayers',
      title: 'systems.renderer.sortingLayers.title',
      type: 'multitext',
    },
  ],
  getInitialState: () => ({
    windowNodeId: '',
    backgroundColor: '#000',
    backgroundAlpha: 1,
    sortingLayers: [],
  }),
}
