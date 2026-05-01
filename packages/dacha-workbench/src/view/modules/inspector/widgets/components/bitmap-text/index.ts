import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const bitmapText: WidgetSchema = {
  fields: [
    {
      name: 'text',
      type: 'textarea',
    },
    {
      name: 'font',
      type: 'file',
      extensions: ['fnt', 'xml'],
    },
    {
      name: 'fontSize',
      type: 'number',
    },
    {
      name: 'align',
      type: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    {
      name: 'color',
      type: 'color',
    },
    {
      name: 'opacity',
      type: 'number',
    },
    {
      name: 'blending',
      type: 'select',
      options: ['normal', 'addition', 'substract', 'multiply'],
    },
    {
      name: 'sortOffsetX',
      type: 'number',
    },
    {
      name: 'sortOffsetY',
      type: 'number',
    },
    {
      name: 'sortingLayer',
      type: 'select',
      options: (getState) =>
        ((getState(PATH) as SortingLayer[]) ?? []).map((layer) => layer.name),
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    text: 'Text',
    font: '',
    fontSize: 10,
    align: 'center',
    color: 'rgb(255,255,255)',
    opacity: 1,
    blending: 'normal',
    sortingLayer: 'default',
    sortOffsetX: 0,
    sortOffsetY: 0,
    disabled: false,
  }),
};
