import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { SpriteWidget } from './view'

export const sprite: WidgetSchema = {
  title: 'components.sprite.title',
  fields: [
    {
      name: 'src',
      title: 'components.sprite.src.title',
      type: 'file',
      properties: {
        extensions: ['png'],
      },
    },
    {
      name: 'width',
      title: 'components.sprite.width.title',
      type: 'number',
    },
    {
      name: 'height',
      title: 'components.sprite.height.title',
      type: 'number',
    },
    {
      name: 'slice',
      title: 'components.sprite.slice.title',
      type: 'number',
    },
    {
      name: 'rotation',
      title: 'components.sprite.rotation.title',
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
      title: 'components.sprite.flipX.title',
      type: 'boolean',
    },
    {
      name: 'flipY',
      title: 'components.sprite.flipY.title',
      type: 'boolean',
    },
    {
      name: 'sortingLayer',
      title: 'components.sprite.sortingLayer.title',
      type: 'select',
      referenceId: 'sortingLayers',
    },
    {
      name: 'fit',
      title: 'components.sprite.fit.title',
      type: 'select',
      referenceId: 'fitTypes',
    },
    {
      name: 'material.type',
      title: 'components.sprite.material.type.title',
      type: 'select',
      referenceId: 'materialTypes',
    },
    {
      name: 'material.options.blending',
      title: 'components.sprite.material.blending.title',
      type: 'select',
      referenceId: 'blendingModes',
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
  references: {
    fitTypes: {
      items: [
        {
          title: 'components.sprite.fitTypes.stretch.title',
          value: 'stretch',
        },
        {
          title: 'components.sprite.fitTypes.repeat.title',
          value: 'repeat',
        },
      ],
    },
    materialTypes: {
      items: [
        {
          title: 'components.sprite.materialTypes.basic.title',
          value: 'basic',
        },
        {
          title: 'components.sprite.materialTypes.lightsensitive.title',
          value: 'lightsensitive',
        },
      ],
    },
    blendingModes: {
      items: [
        {
          title: 'components.sprite.blendingModes.normal.title',
          value: 'normal',
        },
        {
          title: 'components.sprite.blendingModes.addition.title',
          value: 'addition',
        },
        {
          title: 'components.sprite.blendingModes.substract.title',
          value: 'substract',
        },
        {
          title: 'components.sprite.blendingModes.multiply.title',
          value: 'multiply',
        },
      ],
    },
  },
  view: SpriteWidget,
  getInitialState: () => ({
    src: '',
    width: 0,
    height: 0,
    slice: 1,
    rotation: 0,
    sortCenter: [0, 0],
    flipX: false,
    flipY: false,
    sortingLayer: '',
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
