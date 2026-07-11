export class Pool<T> {
  private items: T[] = [];

  constructor(
    private factory: () => T,
    private reset?: (item: T) => void,
  ) {}

  acquire(): T {
    return this.items.pop() ?? this.factory();
  }

  release(item: T): void {
    this.reset?.(item);
    this.items.push(item);
  }

  clear(): void {
    this.items.length = 0;
  }
}
