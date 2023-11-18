export type SubscribeFn = () => void;

export class Observer {
  private subscribers: Array<SubscribeFn>;

  constructor() {
    this.subscribers = [];
  }

  next(): void {
    this.subscribers.forEach((callback) => callback());
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
