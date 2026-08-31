import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { MeshWidget } from './view';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const mesh: WidgetSchema = {
  icon: 'VectorSquare',
  view: MeshWidget,
  sections: {
    texture: { defaultOpen: true },
  },
  fields: [
    {
      name: 'src',
      type: 'file',
      initialValue: '',
      section: 'texture',
      extensions: ['png'],
    },
    {
      name: 'width',
      type: 'number',
      initialValue: 10,
      section: 'texture',
    },
    {
      name: 'height',
      type: 'number',
      initialValue: 10,
      section: 'texture',
    },
    {
      name: 'slice',
      type: 'number',
      initialValue: 1,
      section: 'texture',
    },
    {
      name: 'flipX',
      type: 'boolean',
      initialValue: false,
      section: 'texture',
    },
    {
      name: 'flipY',
      type: 'boolean',
      initialValue: false,
      section: 'texture',
    },
    {
      name: 'color',
      type: 'color',
      initialValue: '#fff',
      section: 'appearance',
      disabledAlpha: true,
    },
    {
      name: 'blending',
      type: 'select',
      initialValue: 'normal',
      section: 'appearance',
      options: ['normal', 'addition', 'substract', 'multiply'],
    },
    {
      name: 'opacity',
      type: 'number',
      initialValue: 1,
      section: 'appearance',
    },
    {
      name: 'sortOffset',
      type: 'vector',
      initialValue: { x: 0, y: 0 },
      section: 'sorting',
    },
    {
      name: 'sortingLayer',
      type: 'select',
      initialValue: 'default',
      section: 'sorting',
      options: (getState) =>
        ((getState(PATH) as SortingLayer[]) ?? []).map((layer) => layer.name),
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
};
