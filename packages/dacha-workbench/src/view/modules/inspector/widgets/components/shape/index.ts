import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const shape: WidgetSchema = {
  icon: 'Shapes4',
  sections: {
    geometry: { defaultOpen: true },
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      initialValue: 'rectangle',
      options: ['rectangle', 'roundRectangle', 'circle', 'ellipse', 'line'],
    },
    {
      name: 'size',
      type: 'vector',
      initialValue: { x: 10, y: 10 },
      section: 'geometry',
      dependency: {
        name: 'type',
        value: 'rectangle|roundRectangle',
      },
    },
    {
      name: 'radius',
      type: 'number',
      initialValue: 5,
      section: 'geometry',
      dependency: {
        name: 'type',
        value: 'roundRectangle|circle',
      },
    },
    {
      name: 'radius',
      type: 'vector',
      initialValue: { x: 5, y: 5 },
      section: 'geometry',
      dependency: {
        name: 'type',
        value: 'ellipse',
      },
    },
    {
      name: 'point1',
      type: 'vector',
      initialValue: { x: -5, y: 0 },
      section: 'geometry',
      dependency: {
        name: 'type',
        value: 'line',
      },
    },
    {
      name: 'point2',
      type: 'vector',
      initialValue: { x: 5, y: 0 },
      section: 'geometry',
      dependency: {
        name: 'type',
        value: 'line',
      },
    },
    {
      name: 'strokeColor',
      type: 'color',
      initialValue: '#fff',
      section: 'appearance',
    },
    {
      name: 'strokeWidth',
      type: 'number',
      initialValue: 0,
      section: 'appearance',
      dependency: {
        name: 'pixelLine',
        value: false,
      },
    },
    {
      name: 'strokeAlignment',
      type: 'select',
      initialValue: 0.5,
      section: 'appearance',
      options: [
        {
          title: 'centered',
          value: 0.5,
        },
        {
          title: 'inside',
          value: 1,
        },
        {
          title: 'outside',
          value: 0,
        },
      ],
    },
    {
      name: 'pixelLine',
      type: 'boolean',
      initialValue: false,
      section: 'appearance',
    },
    {
      name: 'fill',
      type: 'color',
      initialValue: '#fff',
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
      initialValue: false,
    },
  ],
};
