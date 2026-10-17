interface StoreEntry<T> {
  data: T;
  count: number;
}

// Shares a derived render object (texture frames, graphics contexts) between
// the views that use it, and drops it when the last view releases it.
export class CacheStore<T> {
  private cache = new Map<string, StoreEntry<T>>();

  add(key: string, data: T): void {
    this.cache.set(key, { data, count: 0 });
  }

  get(key: string): T | undefined {
    return this.cache.get(key)?.data;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  retain(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.count += 1;
    }
  }

  release(key: string): void {
    const entry = this.cache.get(key);
    if (!entry) {
      return;
    }
    entry.count -= 1;
    if (entry.count <= 0) {
      this.cache.delete(key);
    }
  }
}
