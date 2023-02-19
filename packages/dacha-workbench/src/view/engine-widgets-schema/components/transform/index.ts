import type { WidgetSchema } from '../../../../types/widget-schema'

export const transform: WidgetSchema = {
  title: 'components.transform.title',
  fields: [
    {
      name: 'offsetX',
      title: 'components.transform.offsetX.title',
      type: 'number',
    },
    {
      name: 'offsetY',
      title: 'components.transform.offsetY.title',
      type: 'number',
    },
    {
      name: 'offsetZ',
      title: 'components.transform.offsetZ.title',
      type: 'number',
    },
    {
      name: 'rotation',
      title: 'components.transform.rotation.title',
      type: 'number',
    },
    {
      name: 'scaleX',
      title: 'components.transform.scaleX.title',
      type: 'number',
    },
    {
      name: 'scaleY',
      title: 'components.transform.scaleY.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  }),
}
