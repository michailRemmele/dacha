import { Asset } from './asset';

/**
 * Base class for asset kinds backed by a file, such as a texture or a sound.
 *
 * A kind implements {@link MediaAsset.fetchResource} and, if the resource needs
 * cleanup, {@link MediaAsset.disposeResource}. The engine loads every media asset
 * that the configuration references in an `asset` field before the scene starts.
 * Code that takes an asset by id on its own calls {@link MediaAsset.load}.
 *
 * @example
 * ```ts
 * const texture = this.assets.get(Texture, id);
 * texture?.resource; // the loaded resource, or undefined
 * ```
 *
 * @category Assets
 */
export abstract class MediaAsset<R = unknown> extends Asset {
  private loaded?: R;
  private loading?: Promise<R | undefined>;
  private failed = false;
  private version = 0;

  /** The loaded resource, or `undefined` while it is not loaded. */
  get resource(): R | undefined {
    return this.loaded;
  }

  /**
   * Loads the resource once and returns it. Resolves to `undefined` if loading
   * fails.
   */
  load(): Promise<R | undefined> {
    if (this.loaded !== undefined) {
      return Promise.resolve(this.loaded);
    }
    if (this.loading) {
      return this.loading;
    }
    if (this.failed) {
      return Promise.resolve(undefined);
    }

    const { version } = this;
    const isCurrent = (): boolean => version === this.version;

    this.loading = Promise.resolve()
      .then(() => this.fetchResource())
      .then(
        (resource) => {
          if (!isCurrent()) {
            this.disposeResource?.(resource);
            return undefined;
          }
          this.loaded = resource;
          this.loading = undefined;
          return resource;
        },
        (error: unknown) => {
          if (isCurrent()) {
            this.failed = true;
            this.loading = undefined;
          }
          console.error(`Can't load the resource of asset ${this.id}`, error);
          return undefined;
        },
      );

    return this.loading;
  }

  /**
   * Frees the resource. A load in progress is dropped, and a failed one can be
   * tried again.
   *
   * @internal
   */
  unload(): void {
    if (this.loaded !== undefined) {
      this.disposeResource?.(this.loaded);
      this.loaded = undefined;
    }
    this.version += 1;
    this.loading = undefined;
    this.failed = false;
  }

  /** Fetches the file and returns the resource. */
  protected abstract fetchResource(): Promise<R>;

  /**
   * Frees what the resource holds, such as GPU memory. Optional.
   */
  protected disposeResource?(resource: R): void;
}
