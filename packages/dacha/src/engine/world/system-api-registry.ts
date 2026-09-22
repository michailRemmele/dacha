import type { Constructor } from '../../types/utils';

/**
 * The APIs that systems share with the rest of the game. It is `world.systemApi`.
 *
 * A system registers an API object, and any code finds it by its class.
 *
 * @example
 * ```ts
 * const physics = this.world.systemApi.get(PhysicsAPI);
 * ```
 *
 * @see [System APIs](https://dachajs.org/game-code/systems/)
 *
 * @category Scenes & World
 */
export class SystemAPIRegistry {
  private entries: Map<Constructor<object>, object>;

  /** @internal */
  constructor() {
    this.entries = new Map();
  }

  /**
   * Adds an API. Its class becomes the key to find it.
   *
   * @throws Error If an API of the same class is already registered.
   */
  register<T extends object>(api: T): void {
    const apiClass = api.constructor as Constructor<object>;

    if (this.entries.has(apiClass)) {
      throw new Error(`API already registered: ${apiClass.name}`);
    }

    this.entries.set(apiClass, api);
  }

  /** Removes the API of this class. */
  unregister<T>(apiClass: Constructor<T>): void {
    this.entries.delete(apiClass as Constructor<object>);
  }

  /**
   * Returns the API of this class.
   *
   * @throws Error If no API of this class is registered. Use {@link has} for an
   * API that may be missing.
   */
  get<T>(apiClass: Constructor<T>): T {
    const api = this.entries.get(apiClass as Constructor<object>);

    if (!api) {
      throw new Error(`Can't find API with the following name: ${apiClass.name}`);
    }

    return api as T;
  }

  /** Checks if an API of this class is registered. */
  has<T>(apiClass: Constructor<T>): boolean {
    return this.entries.has(apiClass as Constructor<object>);
  }
}
