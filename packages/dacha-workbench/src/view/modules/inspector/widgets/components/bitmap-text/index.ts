import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const bitmapText: WidgetSchema = {
  fields: [
    {
      name: 'text',
      type: 'textarea',
      initialValue: 'Text',
    },
    {
      name: 'font',
      type: 'file',
      initialValue: '',
      extensions: ['fnt', 'xml'],
    },
    {
      name: 'fontSize',
      type: 'number',
      initialValue: 10,
    },
    {
      name: 'align',
      type: 'select',
      initialValue: 'center',
      options: ['left', 'center', 'right', 'justify'],
    },
    {
      name: 'color',
      type: 'color',
      initialValue: '#000000',
    },
    {
      name: 'opacity',
      type: 'number',
      initialValue: 1,
    },
    {
      name: 'blending',
      type: 'select',
      initialValue: 'normal',
      options: ['normal', 'addition', 'substract', 'multiply'],
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
      name: 'sortingLayer',
      type: 'select',
      initialValue: 'default',
      options: (getState) =>
        ((getState(PATH) as SortingLayer[]) ?? []).map((layer) => layer.name),
    },
    {
      name: 'disabled',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
