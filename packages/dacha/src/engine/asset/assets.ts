import type { ComponentConstructor } from '../component';
import type { SystemBinding } from '../system';
import type { AssetConfig } from '../types';

import { Asset } from './asset';
import type { AssetConstructor } from './asset';
import { MediaAsset } from './media-asset';
import { AssetCollector } from './asset-collector';
import type { AssetSources } from './asset-collector';

/**
 * The {@link Assets} options.
 *
 * @internal
 */
export interface AssetsOptions {
  assetClasses?: AssetConstructor[];
  configs?: AssetConfig[];
  components?: ComponentConstructor[];
  systems?: SystemBinding[];
}

interface AssetEntry {
  asset: Asset;
  refs: Set<string>;
}

/**
 * The project assets.
 *
 * The engine creates an {@link Asset} for every entry in `assets` of the
 * configuration. A {@link MediaAsset} gives its loaded file through
 * {@link MediaAsset.resource}.
 *
 * @example
 * ```ts
 * const texture = this.assets.get(Texture, TEXTURE_ID)?.resource;
 * ```
 *
 * @category Assets
 */
export class Assets {
  private assetClasses: Map<string, AssetConstructor>;
  private storage: Map<string, AssetEntry>;
  private collector: AssetCollector;
  private counts: Map<string, number>;
  private owners: Map<object, Set<string>>;

  /** @internal */
  constructor({
    assetClasses = [],
    configs = [],
    components = [],
    systems = [],
  }: AssetsOptions = {}) {
    this.assetClasses = assetClasses.reduce((acc, AssetClass) => {
      acc.set(AssetClass.assetName, AssetClass);
      return acc;
    }, new Map<string, AssetConstructor>());

    this.storage = new Map();
    this.collector = new AssetCollector({
      components,
      systems,
      assets: assetClasses,
    });
    this.counts = new Map();
    this.owners = new Map();

    configs.forEach((config) => this.register(config));
  }

  /**
   * Creates an asset from its configuration. An asset with the same id is
   * replaced, and its resource is unloaded.
   *
   * @internal
   */
  register(config: AssetConfig): void {
    const previous = this.storage.get(config.id)?.asset;

    this.storage.set(config.id, this.createEntry(config));

    if (previous instanceof MediaAsset) {
      previous.unload();
    }
  }

  /**
   * Removes an asset and unloads its resource.
   *
   * @internal
   */
  unregister(id: string): void {
    const asset = this.storage.get(id)?.asset;

    this.storage.delete(id);
    this.counts.delete(id);

    if (asset instanceof MediaAsset) {
      asset.unload();
    }
  }

  /**
   * Checks if the engine knows an asset kind.
   *
   * @internal
   */
  hasKind(kind: string): boolean {
    return this.assetClasses.has(kind);
  }

  /**
   * Acquires the assets referenced by `sources` and their dependencies for
   * `owner`, loading them as needed. The assets are held immediately, while
   * the returned promise resolves when all assets are loaded.
   *
   * @internal
   */
  async acquire(owner: object, sources: AssetSources): Promise<void> {
    const ids = this.extendWithRefs(this.collector.collectSources(sources));
    ids.forEach((id) => this.counts.set(id, (this.counts.get(id) ?? 0) + 1));

    const previous = this.owners.get(owner);
    this.owners.set(owner, ids);

    if (previous) {
      this.releaseIds(previous);
    }

    await Promise.all(
      Array.from(ids, (id) => {
        const asset = this.storage.get(id)?.asset;
        return asset instanceof MediaAsset ? asset.load() : undefined;
      }),
    );
  }

  /**
   * Drops what `owner` holds and unloads the assets nothing else holds.
   *
   * @internal
   */
  release(owner: object): void {
    const ids = this.owners.get(owner);

    if (ids) {
      this.owners.delete(owner);
      this.releaseIds(ids);
    }
  }

  /**
   * Returns an asset by its id, or `undefined` when there is none.
   */
  get(id: string): Asset | undefined;
  /**
   * Returns an asset of one class by its id, or `undefined` when there is none.
   */
  get<T extends Asset>(
    assetClass: AssetConstructor<T>,
    id: string,
  ): T | undefined;
  get<T extends Asset>(
    idOrClass: string | AssetConstructor<T>,
    classId?: string,
  ): Asset | T | undefined {
    const id = typeof idOrClass === 'string' ? idOrClass : classId;
    const assetClass = typeof idOrClass === 'string' ? undefined : idOrClass;

    if (!id) {
      return undefined;
    }

    const asset = this.storage.get(id)?.asset;

    if (assetClass !== undefined && !(asset instanceof assetClass)) {
      return undefined;
    }

    return asset;
  }

  /** Returns all assets. */
  getAll(): Asset[];
  /** Returns all assets of one class. */
  getAll<T extends Asset>(assetClass: AssetConstructor<T>): T[];
  getAll<T extends Asset>(assetClass?: AssetConstructor<T>): Asset[] | T[] {
    const all = Array.from(this.storage.values(), (entry) => entry.asset);

    if (!assetClass) {
      return all;
    }

    return all.filter((asset): asset is T => asset instanceof assetClass);
  }

  /** Checks if there is an asset with this id. */
  has(id: string): boolean {
    return this.storage.has(id);
  }

  // Extends the given asset ids with all referenced assets, recursively.
  // Unknown ids are skipped with a warning.
  private extendWithRefs(ids: Iterable<string>): Set<string> {
    const result = new Set<string>();
    const stack = [...ids];

    while (stack.length) {
      const id = stack.pop()!;
      if (result.has(id)) {
        continue;
      }

      const entry = this.storage.get(id);
      if (!entry) {
        console.warn(`Can't find asset with the following id: ${id}`);
        continue;
      }

      result.add(id);
      stack.push(...entry.refs);
    }

    return result;
  }

  private releaseIds(ids: Set<string>): void {
    ids.forEach((id) => {
      const count = this.counts.get(id);
      if (count === undefined) {
        return;
      }
      if (count > 1) {
        this.counts.set(id, count - 1);
        return;
      }

      this.counts.delete(id);
      const asset = this.storage.get(id)?.asset;
      if (asset instanceof MediaAsset) {
        asset.unload();
      }
    });
  }

  private createEntry(config: AssetConfig): AssetEntry {
    const AssetClass = this.assetClasses.get(config.kind);

    if (!AssetClass) {
      throw new Error(
        `Can't register asset ${config.id}. Unknown asset kind: ${config.kind}`,
      );
    }

    const asset = new AssetClass({
      id: config.id,
      name: config.name,
      data: config.data,
    });

    return { asset, refs: this.collector.collectAssetRefs(config) };
  }
}
