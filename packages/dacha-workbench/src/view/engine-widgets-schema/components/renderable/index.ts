import type { WidgetSchema } from '../../../../types/widget-schema'

export const renderable: WidgetSchema = {
  title: 'components.renderable.title',
  fields: [
    {
      name: 'type',
      title: 'components.renderable.type.title',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'src',
      title: 'components.renderable.src.title',
      type: 'string',
    },
    {
      name: 'width',
      title: 'components.renderable.width.title',
      type: 'number',
    },
    {
      name: 'height',
      title: 'components.renderable.height.title',
      type: 'number',
    },
    {
      name: 'slice',
      title: 'components.renderable.slice.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'sprite',
      },
    },
    {
      name: 'rotation',
      title: 'components.renderable.rotation.title',
      type: 'number',
    },
    {
      name: 'sortCenter.0',
      title: 'components.renderable.sortCenterX.title',
      type: 'number',
    },
    {
      name: 'sortCenter.1',
      title: 'components.renderable.sortCenterY.title',
      type: 'number',
    },
    {
      name: 'flipX',
      title: 'components.renderable.flipX.title',
      type: 'boolean',
    },
    {
      name: 'flipY',
      title: 'components.renderable.flipY.title',
      type: 'boolean',
    },
    {
      name: 'sortingLayer',
      title: 'components.renderable.sortingLayer.title',
      type: 'string',
    },
    {
      name: 'fit',
      title: 'components.renderable.fit.title',
      type: 'select',
      referenceId: 'fitTypes',
    },
    {
      name: 'material.type',
      title: 'components.renderable.material.type.title',
      type: 'select',
      referenceId: 'materialTypes',
    },
    {
      name: 'material.options.blending',
      title: 'components.renderable.material.blending.title',
      type: 'select',
      referenceId: 'blendingModes',
    },
    {
      name: 'material.options.color',
      title: 'components.renderable.material.color.title',
      type: 'string',
    },
    {
      name: 'material.options.opacity',
      title: 'components.renderable.material.opacity.title',
      type: 'number',
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'components.renderable.types.static.title',
          value: 'static',
        },
        {
          title: 'components.renderable.types.sprite.title',
          value: 'sprite',
        },
      ],
    },
    fitTypes: {
      items: [
        {
          title: 'components.renderable.fitTypes.stretch.title',
          value: 'stretch',
        },
        {
          title: 'components.renderable.fitTypes.repeat.title',
          value: 'repeat',
        },
      ],
    },
    materialTypes: {
      items: [
        {
          title: 'components.renderable.materialTypes.basic.title',
          value: 'basic',
        },
        {
          title: 'components.renderable.materialTypes.lightsensitive.title',
          value: 'lightsensitive',
        },
      ],
    },
    blendingModes: {
      items: [
        {
          title: 'components.renderable.blendingModes.normal.title',
          value: 'normal',
        },
        {
          title: 'components.renderable.blendingModes.addition.title',
          value: 'addition',
        },
        {
          title: 'components.renderable.blendingModes.substract.title',
          value: 'substract',
        },
        {
          title: 'components.renderable.blendingModes.multiply.title',
          value: 'multiply',
        },
      ],
    },
  },
  getInitial: () => ({
    type: 'static',
    src: '',
    width: 0,
    height: 0,
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
