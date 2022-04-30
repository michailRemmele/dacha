import type { SubscribeFn } from './observer';

export class MapObserver {
  private values: Record<string, unknown>;
  private subscribers: Record<string, Array<SubscribeFn>>;

  constructor() {
    this.values = {};
    this.subscribers = {};
  }

  next(value: unknown, id: string): void {
    this.values[id] = value;

    if (!this.subscribers[id]) {
      return;
    }

    this.subscribers[id].forEach((callback) => callback(this.values[id]));
  }

  subscribe(callback: SubscribeFn, id: string): void {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    this.subscribers[id] = this.subscribers[id] || [];
    this.subscribers[id].push(callback);
  }

  unsubscribe(callback: SubscribeFn, id: string): void {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    if (!this.subscribers[id]) {
      return;
    }

    this.subscribers[id] = this.subscribers[id].filter(
      (subscription) => subscription !== callback,
    );
  }
}
