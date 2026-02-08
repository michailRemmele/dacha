import { type ViewContainer } from 'pixi.js';

import type { Component } from '../../../engine/component';

import type {
  PostEffectConstructor,
  PostEffectConfig,
} from './filters/post-effect';
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
  PostEffectConstructor,
  PostEffectConfig,
  ShaderConstructor,
  ShaderUniformDefinitions,
  ShaderUniforms,
};

export interface RendererResources {
  postEffects?: PostEffectConstructor[];
  shaders?: ShaderConstructor[];
}

export interface Time {
  elapsed: number;
}
