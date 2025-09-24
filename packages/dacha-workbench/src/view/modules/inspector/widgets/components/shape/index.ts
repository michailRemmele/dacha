import { type SortingLayer } from 'dacha/renderer';

import type { WidgetSchema } from '../../../../../../types/widget-schema';

const PATH = ['globalOptions', 'name:sorting', 'options', 'layers'];

export const shape: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['rectangle', 'roundRectangle', 'circle', 'ellipse'],
    },
    {
      name: 'width',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'rectangle|roundRectangle',
      },
    },
    {
      name: 'height',
      type: 'number',
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
      dependency: {
        name: 'type',
        value: 'ellipse',
      },
    },
    {
      name: 'radiusY',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'ellipse',
      },
    },
    {
      name: 'strokeColor',
      type: 'color',
    },
    {
      name: 'strokeWidth',
      type: 'number',
      dependency: {
        name: 'pixelLine',
        value: false,
      },
    },
    {
      name: 'strokeAlignment',
      type: 'select',
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
    },
    {
      name: 'fill',
      type: 'color',
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
      name: 'sortingLayer',
      type: 'select',
      options: (getState) =>
        ((getState(PATH) as SortingLayer[]) ?? []).map((layer) => layer.name),
    },
    {
      name: 'blending',
      type: 'select',
      options: ['normal', 'addition', 'substract', 'multiply'],
    },
    {
      name: 'opacity',
      type: 'number',
    },
    {
      name: 'disabled',
      type: 'boolean',
    },
  ],
  getInitialState: () => ({
    type: 'rectangle',
    width: 10,
    height: 10,
    strokeWidth: 0,
    strokeColor: '#fff',
    strokeAlignment: 0.5,
    fill: '#fff',
    pixelLine: false,
    sortCenter: [0, 0],
    sortingLayer: 'default',
    blending: 'normal',
    opacity: 1,
    disabled: false,
  }),
};
