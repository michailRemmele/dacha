import type { AssetConfig } from '../types';

import { Asset } from './asset';
import type { AssetConstructor } from './asset';

/**
 * The project assets. Systems get it in `options.assets`.
 *
 * The engine creates an {@link Asset} for every entry in `assets` of the
 * configuration.
 *
 * @example
 * ```ts
 * const texture = this.assets.get(TEXTURE_ID, Texture);
 * ```
 *
 * @category Assets
 */
export class Assets {
  private assetClasses: Map<string, AssetConstructor>;
  private storage: Map<string, Asset>;

  /** @internal */
  constructor(assetClasses: AssetConstructor[]) {
    this.assetClasses = assetClasses.reduce((acc, AssetClass) => {
      acc.set(AssetClass.assetName, AssetClass);
      return acc;
    }, new Map<string, AssetConstructor>());

    this.storage = new Map();
  }

  /**
   * Creates an asset from its configuration.
   *
   * @internal
   */
  register(config: AssetConfig): void {
    if (this.storage.has(config.id)) {
      throw new Error(
        `Asset with the following id is already registered: ${config.id}`,
      );
    }

    const AssetClass = this.assetClasses.get(config.kind);

    if (!AssetClass) {
      throw new Error(
        `Can't register asset ${config.id}. Unknown asset kind: ${config.kind}`,
      );
    }

    this.storage.set(
      config.id,
      new AssetClass({
        id: config.id,
        name: config.name,
        data: config.data,
      }),
    );
  }

  /**
   * Returns an asset by its id.
   *
   * @throws Error If there is no asset with this id.
   */
  get(id: string): Asset;
  /**
   * Returns an asset by its id and checks its class.
   *
   * @throws Error If there is no asset with this id, or it is not an instance of `assetClass`.
   */
  get<T extends Asset>(id: string, assetClass: AssetConstructor<T>): T;
  get<T extends Asset>(
    id: string,
    assetClass?: AssetConstructor<T>,
  ): Asset | T {
    const asset = this.storage.get(id);

    if (!asset) {
      throw new Error(`Can't find asset with the following id: ${id}`);
    }

    if (assetClass !== undefined && !(asset instanceof assetClass)) {
      throw new Error(
        `Asset ${id} is not an instance of ${assetClass.assetName} kind`,
      );
    }

    return asset;
  }

  /** Returns all assets. */
  getAll(): Asset[];
  /** Returns all assets of one class. */
  getAll<T extends Asset>(assetClass: AssetConstructor<T>): T[];
  getAll<T extends Asset>(assetClass?: AssetConstructor<T>): Asset[] | T[] {
    if (!assetClass) {
      return Array.from(this.storage.values());
    }

    return Array.from(this.storage.values()).filter(
      (asset): asset is T => asset instanceof assetClass,
    );
  }

  /** Checks if there is an asset with this id. */
  has(id: string): boolean {
    return this.storage.has(id);
  }
}
