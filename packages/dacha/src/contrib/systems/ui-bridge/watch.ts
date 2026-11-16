import type { UIValue } from './types';

const isEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  return a.every((item, index) => Object.is(item, b[index]));
};

/**
 * A value computed by a selector.
 */
export class Watch<T> implements UIValue<T> {
  private compute: () => T;
  private equals: (a: T, b: T) => boolean;
  private active: Set<Watch<unknown>>;
  private listeners: Set<(value: T) => void>;
  private value?: T;
  private hasValue: boolean;

  /**
   * @param compute - Reads the value.
   * @param active - The values that have listeners. The owner refreshes only them.
   * @param equals - Compares two values.
   */
  constructor(
    compute: () => T,
    active: Set<Watch<unknown>>,
    equals: (a: T, b: T) => boolean = isEqual,
  ) {
    this.compute = compute;
    this.equals = equals;
    this.active = active;
    this.listeners = new Set();
    this.hasValue = false;
  }

  get(): T {
    if (!this.listeners.size) {
      this.recompute();
    }
    return this.value as T;
  }

  subscribe(listener: (value: T) => void): () => void {
    if (!this.listeners.size) {
      this.recompute();
      this.active.add(this as Watch<unknown>);
    }
    this.listeners.add(listener);
    listener(this.value as T);
    return (): void => {
      this.listeners.delete(listener);
      if (!this.listeners.size) {
        this.active.delete(this as Watch<unknown>);
      }
    };
  }

  refresh(): void {
    if (this.listeners.size && this.recompute()) {
      this.listeners.forEach((listener) => listener(this.value as T));
    }
  }

  clear(): void {
    this.listeners.clear();
  }

  private recompute(): boolean {
    const next = this.compute();
    if (this.hasValue && this.equals(this.value as T, next)) {
      return false;
    }
    this.value = next;
    this.hasValue = true;
    return true;
  }
}
