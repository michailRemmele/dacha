import type { ActorConfig, AssetConfig, SystemConfig } from '../types';
import type { ReferenceType } from '../decorators';
import type { Reference, ReferenceWalker } from '../reference';
import type { TemplateCollection } from '../template';

import { Asset } from './asset';
import type { AssetConstructor } from './asset';
import { MediaAsset } from './media-asset';

/**
 * What an owner holds with {@link Assets.acquire}.
 *
 * @category Assets
 */
export interface AssetSources {
  /** Asset ids. The assets they reference are held too. */
  assets?: string[];
  /**
   * Template ids. The assets of these templates are held too.
   */
  templates?: string[];
  /** @internal */
  actors?: ActorConfig[];
  /** @internal */
  systems?: SystemConfig[];
}

/**
 * The {@link Assets} options.
 *
 * @internal
 */
export interface AssetsOptions {
  assetClasses?: AssetConstructor[];
  configs?: AssetConfig[];
  templates: TemplateCollection;
  walker: ReferenceWalker;
}

interface AssetEntry {
  asset: Asset;
  config: AssetConfig;
}

const PRELOAD_TYPES: ReferenceType[] = ['asset', 'template'];

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
  private walker: ReferenceWalker;
  private templates: TemplateCollection;
  private counts: Map<string, number>;
  private owners: Map<object | string, Set<string>>;

  /** @internal */
  constructor({
    assetClasses = [],
    configs = [],
    templates,
    walker,
  }: AssetsOptions) {
    this.assetClasses = assetClasses.reduce((acc, AssetClass) => {
      acc.set(AssetClass.assetName, AssetClass);
      return acc;
    }, new Map<string, AssetConstructor>());

    this.storage = new Map();
    this.walker = walker;
    this.templates = templates;
    this.counts = new Map();
    this.owners = new Map();

    configs.forEach((config) => this.register(config));
  }

  /**
   * Creates an asset from its configuration.
   *
   * @internal
   */
  register(config: AssetConfig): void {
    const previous = this.storage.get(config.id)?.asset;
    const asset = this.createAsset(config);

    this.storage.set(config.id, { asset, config });

    if (previous instanceof MediaAsset) {
      previous.unload();
    }
    if (this.counts.has(config.id) && asset instanceof MediaAsset) {
      void asset.load();
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
   * Holds assets for `owner` and loads the media among them.
   *
   * A second call by the same owner replaces what it holds. Pass the full set
   * in one call. Assets that both sets share stay loaded.
   *
   * Call {@link Assets.release} when the owner no longer
   * needs the assets. Do not pass a scene as the owner: that replaces what the
   * engine holds for the scene.
   *
   * @example
   * ```ts
   * async onSceneLoad() {
   *   await this.assets.acquire(this, { assets: [cutsceneId], templates: [bossId] });
   * }
   *
   * onSceneDestroy() {
   *   this.assets.release(this);
   * }
   * ```
   */
  async acquire(owner: object | string, sources: AssetSources): Promise<void> {
    const ids = this.collectAssetIds(sources);
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
   * Drops what `owner` holds with {@link Assets.acquire}. An asset that no
   * owner holds is unloaded.
   */
  release(owner: object | string): void {
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

  private collectAssetIds(sources: AssetSources): Set<string> {
    const assetIds = new Set<string>();
    const seen = new Set<string>();
    const stack: Reference[] = [
      ...(sources.assets ?? []).map((id) => ({ type: 'asset' as const, id })),
      ...(sources.templates ?? []).map((id) => ({
        type: 'template' as const,
        id,
      })),
      ...this.walker.find(
        { actors: sources.actors, systems: sources.systems },
        PRELOAD_TYPES,
      ),
    ];

    while (stack.length) {
      const { type, id } = stack.pop()!;
      const key = `${type}:${id}`;
      if (!id || seen.has(key)) {
        continue;
      }
      seen.add(key);

      switch (type) {
        case 'template': {
          if (!this.templates.has(id)) {
            console.warn(`Can't find template with the following id: ${id}`);
            break;
          }
          stack.push(
            ...this.walker.find(
              { templates: [this.templates.get(id)] },
              PRELOAD_TYPES,
            ),
          );
          break;
        }
        case 'asset': {
          const entry = this.storage.get(id);
          if (!entry) {
            console.warn(`Can't find asset with the following id: ${id}`);
            break;
          }
          assetIds.add(id);
          stack.push(
            ...this.walker.find({ assets: [entry.config] }, PRELOAD_TYPES),
          );
          break;
        }
      }
    }

    return assetIds;
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

  private createAsset(config: AssetConfig): Asset {
    const AssetClass = this.assetClasses.get(config.kind);

    if (!AssetClass) {
      throw new Error(
        `Can't register asset ${config.id}. Unknown asset kind: ${config.kind}`,
      );
    }

    return new AssetClass({
      id: config.id,
      name: config.name,
      data: config.data,
    });
  }
}
