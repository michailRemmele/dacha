import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const sprite: WidgetSchema = {
  fields: [
    {
      name: 'src',
      type: 'file',
      initialValue: '',
      extensions: ['png'],
    },
    {
      name: 'width',
      type: 'number',
      initialValue: 10,
    },
    {
      name: 'height',
      type: 'number',
      initialValue: 10,
    },
    {
      name: 'slice',
      type: 'number',
      initialValue: 1,
    },
    {
      name: 'sortOffsetX',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'sortOffsetY',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'textureOffsetX',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'fit',
        value: 'repeat',
      },
    },
    {
      name: 'textureOffsetY',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'fit',
        value: 'repeat',
      },
    },
    {
      name: 'flipX',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'flipY',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'sortingLayer',
      type: 'select',
      initialValue: 'default',
      options: (getState) =>
        ((getState(PATH) as SortingLayer[]) ?? []).map((layer) => layer.name),
    },
    {
      name: 'fit',
      type: 'select',
      initialValue: 'stretch',
      options: ['stretch', 'repeat'],
    },
    {
      name: 'blending',
      type: 'select',
      initialValue: 'normal',
      options: ['normal', 'addition', 'substract', 'multiply'],
    },
    {
      name: 'color',
      type: 'color',
      initialValue: '#fff',
      disabledAlpha: true,
    },
    {
      name: 'opacity',
      type: 'number',
      initialValue: 1,
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
};
