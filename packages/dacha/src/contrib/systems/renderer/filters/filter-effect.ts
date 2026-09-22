import type { Filter } from 'pixi.js';

import type { Constructor } from '../../../../types/utils';

/**
 * A filter effect with its options, as the configuration and
 * {@link RendererAPI} store it.
 *
 * @category Rendering
 */
export interface FilterEffectConfig {
  /** The `behaviorName` of the filter effect class. */
  name: string;
  /** The values of the effect fields. The effect methods get them as `options`. */
  options: Record<string, unknown>;
}

/**
 * Base class for post-processing effects on the whole screen.
 *
 * Extend it and name the class with `@DefineFilterEffect` from
 * `dacha-workbench/decorators`.
 *
 * @see [Filter effects](https://dachajs.org/systems/rendering/filter-effects/)
 *
 * @category Rendering
 */
export abstract class FilterEffect {
  /**
   * The name the configuration uses for the filter effect. `@DefineFilterEffect` from
   * `dacha-workbench/decorators` sets it, so a game usually does not assign it.
   */
  static behaviorName: string;
  /** Runs when the effect is added. Returns a pixi.js `Filter`. */
  abstract create(options: unknown): Filter;
  /**
   * Runs every frame. Changes the filter. `elapsedTime` is in seconds. Optional.
   * Without it, the filter keeps the values `create` gave it.
   */
  update?(filter: Filter, options: unknown, elapsedTime: number): void;
}

/**
 * A filter effect class: a constructor with a static `behaviorName`.
 *
 * @category Rendering
 */
export type FilterEffectConstructor = Constructor<FilterEffect> & {
  behaviorName: string;
};
