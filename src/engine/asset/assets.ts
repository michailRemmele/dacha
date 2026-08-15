import type { AssetConfig } from '../types';

import { Asset } from './asset';
import type { AssetConstructor } from './asset';

/**
 * Registry of project assets.
 *
 * @category Core
 */
export class Assets {
  private assetClasses: Map<string, AssetConstructor>;
  private storage: Map<string, Asset>;

  constructor(assetClasses: AssetConstructor[]) {
    this.assetClasses = assetClasses.reduce((acc, AssetClass) => {
      acc.set(AssetClass.assetName, AssetClass);
      return acc;
    }, new Map<string, AssetConstructor>());

    this.storage = new Map();
  }

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

  get(id: string): Asset;
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

  getAll(): Asset[];
  getAll<T extends Asset>(assetClass: AssetConstructor<T>): T[];
  getAll<T extends Asset>(assetClass?: AssetConstructor<T>): Asset[] | T[] {
    if (!assetClass) {
      return Array.from(this.storage.values());
    }

    return Array.from(this.storage.values()).filter(
      (asset): asset is T => asset instanceof assetClass,
    );
  }

  has(id: string): boolean {
    return this.storage.has(id);
  }
}
