interface StoreEntry<T> {
  data: T;
  count: number;
}

export class CacheStore<T> {
  private cache: Map<string, StoreEntry<T>>;

  constructor() {
    this.cache = new Map();
  }

  add(src: string, data: T): void {
    this.cache.set(src, { data, count: 0 });
  }

  get(src: string): T | undefined {
    const entry = this.cache.get(src);
    return entry ? entry.data : undefined;
  }

  retain(src: string): void {
    const entry = this.cache.get(src);
    if (entry) {
      entry.count += 1;
    }
  }

  release(src: string, clean?: boolean): void {
    const entry = this.cache.get(src);
    if (entry) {
      entry.count -= 1;
      if (clean && entry.count <= 0) {
        this.cache.delete(src);
      }
    }
  }

  has(src: string): boolean {
    return this.cache.has(src);
  }

  get size(): number {
    return this.cache.size;
  }

  // TODO: It's hard to find a place in a system's lifecycle to call this method
  // Find another way to keep resources until scene is destroyed
  cleanReleased(): void {
    this.cache.forEach((entry, src) => {
      if (entry.count <= 0) {
        this.cache.delete(src);
      }
    });
  }

  clear(): void {
    this.cache.clear();
  }
}
