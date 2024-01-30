import type { SceneEventMap } from '../../types/events';

import type {
  EventType,
  EventPayload,
  EventMap,
  ListenerFn,
} from './types';

export class EventTarget<T extends EventMap<T> = SceneEventMap> {
  // comment: To avoid type checking errors inside implementation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listenersMap: Map<EventType, Array<ListenerFn<any, any, any>>>;

  constructor() {
    this.listenersMap = new Map();
  }

  addEventListener<K extends EventType>(
    eventName: K,
    callback: ListenerFn<T, this, K>,
  ): void {
    if (!this.listenersMap.has(eventName)) {
      this.listenersMap.set(eventName, []);
    }

    this.listenersMap.get(eventName)?.push(callback);
  }

  removeEventListener<K extends EventType>(
    eventName: K,
    callback: ListenerFn<T, this, K>,
  ): void {
    if (!this.listenersMap.has(eventName)) {
      return;
    }

    const nextListeners = this.listenersMap.get(eventName)!.filter(
      (listener) => listener !== callback,
    );

    if (nextListeners.length === 0) {
      this.listenersMap.delete(eventName);
    } else {
      this.listenersMap.set(eventName, nextListeners);
    }
  }

  emit<K extends EventType>(type: K, ...payload: EventPayload<T, K>): void {
    const event = {
      ...payload[0],
      type,
      target: this,
    };
    this.listenersMap.get(type)?.forEach((listener) => listener(event));
  }

  removeAllListeners(): void {
    this.listenersMap.clear();
  }
}
