import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const shape: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      initialValue: 'rectangle',
      options: ['rectangle', 'roundRectangle', 'circle', 'ellipse', 'line'],
    },
    {
      name: 'sizeX',
      type: 'number',
      initialValue: 10,
      dependency: {
        name: 'type',
        value: 'rectangle|roundRectangle',
      },
    },
    {
      name: 'sizeY',
      type: 'number',
      initialValue: 10,
      dependency: {
        name: 'type',
        value: 'rectangle|roundRectangle',
      },
    },
    {
      name: 'radius',
      type: 'number',
      initialValue: 5,
      dependency: {
        name: 'type',
        value: 'roundRectangle|circle',
      },
    },
    {
      name: 'radiusX',
      type: 'number',
      initialValue: 5,
      dependency: {
        name: 'type',
        value: 'ellipse',
      },
    },
    {
      name: 'radiusY',
      type: 'number',
      initialValue: 5,
      dependency: {
        name: 'type',
        value: 'ellipse',
      },
    },
    {
      name: 'point1X',
      type: 'number',
      initialValue: -5,
      dependency: {
        name: 'type',
        value: 'line',
      },
    },
    {
      name: 'point1Y',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'type',
        value: 'line',
      },
    },
    {
      name: 'point2X',
      type: 'number',
      initialValue: 5,
      dependency: {
        name: 'type',
        value: 'line',
      },
    },
    {
      name: 'point2Y',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'type',
        value: 'line',
      },
    },
    {
      name: 'strokeColor',
      type: 'color',
      initialValue: '#fff',
    },
    {
      name: 'strokeWidth',
      type: 'number',
      initialValue: 0,
      dependency: {
        name: 'pixelLine',
        value: false,
      },
    },
    {
      name: 'strokeAlignment',
      type: 'select',
      initialValue: 0.5,
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
    },
    {
      name: 'fill',
      type: 'color',
      initialValue: '#fff',
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
      name: 'blending',
      type: 'select',
      initialValue: 'normal',
      options: ['normal', 'addition', 'substract', 'multiply'],
    },
    {
      name: 'opacity',
      type: 'number',
      initialValue: 1,
    },
    {
      name: 'disabled',
      type: 'boolean',
      initialValue: false,
    },
  ],
};
