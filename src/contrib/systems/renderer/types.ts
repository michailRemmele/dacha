import { type ViewContainer } from 'pixi.js';

import type { Component } from '../../../engine/component';

import type {
  FilterEffectConstructor,
  FilterEffectConfig,
} from './filters/filter-effect';
import type {
  ShaderConstructor,
  ShaderUniformDefinitions,
  ShaderUniforms,
} from './material/shader';

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

export type {
  FilterEffectConstructor,
  FilterEffectConfig,
  ShaderConstructor,
  ShaderUniformDefinitions,
  ShaderUniforms,
};

export interface RendererResources {
  filterEffects?: FilterEffectConstructor[];
  shaders?: ShaderConstructor[];
}

export interface Time {
  elapsed: number;
}
