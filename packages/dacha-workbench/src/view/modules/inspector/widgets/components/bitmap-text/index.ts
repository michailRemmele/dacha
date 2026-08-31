import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const bitmapText: WidgetSchema = {
  icon: 'Font',
  sections: {
    text: { defaultOpen: true },
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      initialValue: 'Text',
      section: 'text',
    },
    {
      name: 'font',
      type: 'file',
      initialValue: '',
      section: 'text',
      extensions: ['fnt', 'xml'],
    },
    {
      name: 'fontSize',
      type: 'number',
      initialValue: 10,
      section: 'text',
    },
    {
      name: 'align',
      type: 'select',
      initialValue: 'center',
      section: 'text',
      options: ['left', 'center', 'right', 'justify'],
    },
    {
      name: 'color',
      type: 'color',
      initialValue: '#000000',
      section: 'appearance',
    },
    {
      name: 'opacity',
      type: 'number',
      initialValue: 1,
      section: 'appearance',
    },
    {
      name: 'blending',
      type: 'select',
      initialValue: 'normal',
      section: 'appearance',
      options: ['normal', 'addition', 'substract', 'multiply'],
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
      initialValue: false,
    },
  ],
};
