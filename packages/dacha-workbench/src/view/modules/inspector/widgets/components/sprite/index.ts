import type { WidgetSchema } from '../../../../../../types/widget-schema'
import type { SortingLayer } from '../../types/sprite-renderer'

const PATH = ['globalOptions', 'name:sortingLayers', 'options', 'layers']

export const sprite: WidgetSchema = {
  fields: [
    {
      name: 'src',
      type: 'file',
      extensions: ['png'],
    },
    {
      name: 'width',
      type: 'number',
    },
    {
      name: 'height',
      type: 'number',
    },
    {
      name: 'slice',
      type: 'number',
    },
    {
      name: 'rotation',
      type: 'number',
    },
    {
      name: 'sortCenter.0',
      title: 'components.sprite.sortCenterX.title',
      type: 'number',
    },
    {
      name: 'sortCenter.1',
      title: 'components.sprite.sortCenterY.title',
      type: 'number',
    },
    {
      name: 'flipX',
      type: 'boolean',
    },
    {
      name: 'flipY',
      type: 'boolean',
    },
    {
      name: 'sortingLayer',
      type: 'select',
      options: (getState) => (getState(PATH) as SortingLayer[] ?? []).map((layer) => layer.name),
    },
    {
      name: 'fit',
      type: 'select',
      options: [
        'stretch',
        'repeat',
      ],
    },
    {
      name: 'material.type',
      title: 'components.sprite.material.type.title',
      type: 'select',
      options: [
        'basic',
        'lightsensitive',
      ],
    },
    {
      name: 'material.options.blending',
      title: 'components.sprite.material.blending.title',
      type: 'select',
      options: [
        'normal',
        'addition',
        'substract',
        'multiply',
      ],
    },
    {
      name: 'material.options.color',
      title: 'components.sprite.material.color.title',
      type: 'color',
    },
    {
      name: 'material.options.opacity',
      title: 'components.sprite.material.opacity.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    src: '',
    width: 0,
    height: 0,
    slice: 1,
    rotation: 0,
    sortCenter: [0, 0],
    flipX: false,
    flipY: false,
    sortingLayer: 'default',
    fit: 'stretch',
    material: {
      type: 'basic',
      options: {
        blending: 'normal',
        color: '#fff',
        opacity: 1,
      },
    },
  }),
}
