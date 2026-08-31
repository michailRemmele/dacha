import type { Constructor } from '../../types/utils';

/**
 * Registry for system-exposed APIs.
 *
 * APIs are stored by their class constructor as a key:
 * `world.systemApi.get(PhysicsAPI)`.
 *
 * @category Core
 */
export class SystemAPIRegistry {
  private entries: Map<Constructor<object>, object>;

  constructor() {
    this.entries = new Map();
  }

  register<T extends object>(api: T): void {
    const apiClass = api.constructor as Constructor<object>;

    if (this.entries.has(apiClass)) {
      throw new Error(`API already registered: ${apiClass.name}`);
    }

    this.entries.set(apiClass, api);
  }

  unregister<T>(apiClass: Constructor<T>): void {
    this.entries.delete(apiClass as Constructor<object>);
  }

  get<T>(apiClass: Constructor<T>): T {
    const api = this.entries.get(apiClass as Constructor<object>);

    if (!api) {
      throw new Error(`Can't find API with the following name: ${apiClass.name}`);
    }

    return api as T;
  }

  has<T>(apiClass: Constructor<T>): boolean {
    return this.entries.has(apiClass as Constructor<object>);
  }
}
