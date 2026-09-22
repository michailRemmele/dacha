import type { Constructor } from '../../types/utils';

/**
 * Options passed to an asset constructor.
 *
 * @category Assets
 */
export interface AssetOptions<T = Record<string, unknown>> {
  /** Unique identifier of the asset */
  id: string;
  /** Name of the asset */
  name: string;
  /** Asset fields declared by the schema of its kind */
  data: T;
}

/**
 * Base class for all assets.
 *
 * An asset is a piece of project data: either a
 * reference to a media file plus its metadata, or plain data described
 * by the schema of its kind.
 *
 * @category Assets
 */
export abstract class Asset {
  /**
   * The name the configuration uses for the asset kind, such as `texture`.
   *
   * `@DefineAsset` from `dacha-workbench/decorators` sets it, so a game usually
   * does not assign it.
   */
  static assetName: string;

  /** Unique identifier of the asset */
  readonly id: string;
  /** Name of the asset */
  readonly name: string;

  constructor(options: AssetOptions<unknown>) {
    this.id = options.id;
    this.name = options.name;
  }
}

/**
 * An asset class: a constructor with a static `assetName`.
 *
 * @category Assets
 */
export type AssetConstructor<T extends Asset = Asset> = Constructor<T> & {
  assetName: string;
};
