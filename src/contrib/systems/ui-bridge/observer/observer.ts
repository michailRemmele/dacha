export type SubscribeFn = (value: unknown) => void;

export class Observer {
  private value: unknown;
  private subscribers: Array<SubscribeFn>;

  constructor() {
    this.value = null;
    this.subscribers = [];
  }

  next(value: unknown): void {
    this.value = value;
    this.subscribers.forEach((callback) => callback(this.value));
  }

  subscribe(callback: SubscribeFn): void {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    this.subscribers.push(callback);
  }

  unsubscribe(callback: SubscribeFn): void {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    this.subscribers = this.subscribers.filter((subscription) => subscription !== callback);
  }
}
