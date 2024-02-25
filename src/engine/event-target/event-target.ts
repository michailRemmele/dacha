import type {
  Event,
  EventType,
  ListenerFn,
} from './types';

export class EventTarget {
  public parent: EventTarget | null;

  private listenersMap: Map<EventType, Array<ListenerFn>>;

  constructor() {
    this.listenersMap = new Map();

    this.parent = null;
  }

  addEventListener(type: EventType, callback: ListenerFn): void {
    if (!this.listenersMap.has(type)) {
      this.listenersMap.set(type, []);
    }

    this.listenersMap.get(type)?.push(callback);
  }

  getEventListeners(type: EventType): Array<ListenerFn> | undefined {
    return this.listenersMap.get(type);
  }

  removeEventListener(type: EventType, callback: ListenerFn): void {
    if (!this.listenersMap.has(type)) {
      return;
    }

    const nextListeners = this.listenersMap.get(type)!.filter(
      (listener) => listener !== callback,
    );

    if (nextListeners.length === 0) {
      this.listenersMap.delete(type);
    } else {
      this.listenersMap.set(type, nextListeners);
    }
  }

  emit(type: EventType, payload?: Record<string, unknown>): void {
    let isPropagationStopped = false;

    const stopPropagation = (): void => {
      isPropagationStopped = true;
    };

    const event: Event = {
      ...payload,
      type,
      target: this,
      currentTarget: this,
      stopPropagation,
    };

    let target: EventTarget | null = this;

    while (target !== null && !isPropagationStopped) {
      event.currentTarget = target;

      const listeners = target.getEventListeners(type) as Array<ListenerFn>;
      listeners?.forEach((listener) => listener(event));

      target = target.parent;
    }
  }

  removeAllListeners(): void {
    this.listenersMap.clear();
  }
}
