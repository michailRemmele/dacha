import type { Filter } from 'pixi.js';

import type { Constructor } from '../../../../types/utils';
import type { Assets } from '../../../../engine/asset';

/**
 * A filter effect with its options, as the configuration and
 * {@link RendererAPI} store it.
 *
 * @category Rendering
 */
export interface FilterEffectConfig {
  /** The `filterEffectName` of the filter effect class. */
  name: string;
  /** The values of the effect fields. The effect methods get them as `options`. */
  options: Record<string, unknown>;
}

/**
 * What the renderer passes to a filter effect constructor.
 *
 * @category Rendering
 */
export interface FilterEffectOptions {
  /** The project assets. Read textures for the filter from it in `create`. */
  assets: Assets;
}

/**
 * Base class for post-processing effects on the whole screen.
 *
 * Extend it and name the class with {@link DefineFilterEffect}.
 *
 * @see [Filter effects](https://dachajs.org/systems/rendering/filter-effects/)
 *
 * @category Rendering
 */
export abstract class FilterEffect {
  /**
   * The name the configuration uses for the filter effect. {@link DefineFilterEffect}
   * sets it, so a game usually does not assign it.
   */
  static filterEffectName: string;

  /** The project assets. */
  protected assets: Assets;

  /** The renderer creates filter effects; a game does not call it. */
  constructor(options: FilterEffectOptions) {
    this.assets = options.assets;
  }

  /** Runs when the effect is added. Returns a pixi.js `Filter`. */
  abstract create(options: unknown): Filter;
  /**
   * Runs every frame. Changes the filter. `elapsedTime` is in seconds. Optional.
   * Without it, the filter keeps the values `create` gave it.
   */
  update?(filter: Filter, options: unknown, elapsedTime: number): void;
}

/**
 * A filter effect class: a constructor with a static `filterEffectName`.
 *
 * @category Rendering
 */
export type FilterEffectConstructor = Constructor<FilterEffect> & {
  filterEffectName: string;
};
