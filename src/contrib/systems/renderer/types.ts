import { type ViewContainer } from 'pixi.js';

import type { Component } from '../../../engine/component';

export type { RenderEffectConstructor } from './filters/render-effect';

export interface SortingLayer {
  id: string;
  name: string;
}

export type SortingOrder =
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft'
  | 'topRight';

export interface Sorting {
  layers: SortingLayer[];
  order: SortingOrder;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface ViewComponent extends Component {
  renderData?: {
    view: ViewContainer;
  };
}
