import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

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
      type: 'boolean',
    },
    {
      name: 'flipY',
      type: 'boolean',
    },
    {
      name: 'sortingLayer',
      type: 'select',
      options: (getState) =>
        ((getState(PATH) as SortingLayer[]) ?? []).map((layer) => layer.name),
    },
    {
      name: 'fit',
      type: 'select',
      options: ['stretch', 'repeat'],
    },
    {
      name: 'blending',
      type: 'select',
      options: ['normal', 'addition', 'substract', 'multiply'],
    },
    {
      name: 'color',
      type: 'color',
      disabledAlpha: true,
    },
    {
      name: 'opacity',
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
    blending: 'normal',
    color: '#fff',
    opacity: 1,
  }),
};
