import { type ViewContainer } from 'pixi.js';

import type { Component } from '../../../engine/component';

import type {
  FilterEffectConstructor,
  FilterEffectConfig,
} from './filters/filter-effect';
import type {
  ShaderConstructor,
  ShaderUniform,
  ShaderUniformDefinitions,
  ShaderUniformType,
  ShaderUniformValue,
  ShaderUniforms,
} from './material/shader';

/**
 * A sorting layer. View components pick it by name in `sortingLayer`.
 *
 * @category Rendering
 */
export interface SortingLayer {
  /** A unique id. */
  id: string;
  /** The name view components use in `sortingLayer`. */
  name: string;
}

/**
 * Which views are drawn on top inside one sorting layer.
 *
 * - `bottomRight`: lower views. At the same height, views further right.
 * - `bottomLeft`: lower views. At the same height, views further left.
 * - `topLeft`: higher views. At the same height, views further left.
 * - `topRight`: higher views. At the same height, views further right.
 *
 * @category Rendering
 */
export type SortingOrder =
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft'
  | 'topRight';

/**
 * The global option `sorting`. It sets the draw order of views.
 *
 * @see [Draw order](https://dachajs.org/systems/rendering/#draw-order)
 *
 * @category Rendering
 */
export interface Sorting {
  /** The sorting layers. The first layer is at the back, and the last layer is in front. */
  layers: SortingLayer[];
  /** The draw order inside one layer. The default is `bottomRight`. */
  order: SortingOrder;
}

/**
 * A rectangle in world coordinates. {@link RendererAPI.getBounds} returns it.
 *
 * @category Rendering
 */
export interface Bounds {
  /** The left edge. */
  minX: number;
  /** The top edge. */
  minY: number;
  /** The right edge. */
  maxX: number;
  /** The bottom edge. */
  maxY: number;
  /** The width. */
  width: number;
  /** The height. */
  height: number;
}

/** @internal The fields the renderer reads from every view component. */
export interface ViewComponent extends Component {
  disabled?: boolean;
  renderData?: {
    view: ViewContainer;
  };
}

export type {
  FilterEffectConstructor,
  FilterEffectConfig,
  ShaderConstructor,
  ShaderUniform,
  ShaderUniformDefinitions,
  ShaderUniformType,
  ShaderUniformValue,
  ShaderUniforms,
};

/**
 * The resources of {@link Renderer}. Pass them to the engine in `resources`
 * under `Renderer.systemName`.
 *
 * @category Rendering
 */
export interface RendererResources {
  /** The filter effect classes of the game. */
  filterEffects?: FilterEffectConstructor[];
  /** The shader classes of the game. */
  shaders?: ShaderConstructor[];
}
