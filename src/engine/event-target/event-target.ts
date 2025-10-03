import type {
  Event,
  EventType,
  ListenerFn,
} from './types';
import { eventQueue } from './event-queue';

/**
 * Base class for all event targets.
 * 
 * @category Core
 */
export class EventTarget {
  /** Parent event target */
  public parent: EventTarget | null;

  private listenersMap: Map<EventType, ListenerFn[]>;

  /**
   * Creates a new event target.
   */
  constructor() {
    this.listenersMap = new Map();

    this.parent = null;
  }

  /**
   * Adds an event listener to the event target.
   *
   * @param type - Type of event to listen for
   * @param callback - Function to call when the event is triggered
   */
  addEventListener(type: EventType, callback: ListenerFn): void {
    if (!this.listenersMap.has(type)) {
      this.listenersMap.set(type, []);
    }

    this.listenersMap.get(type)?.push(callback);
  }

  /**
   * Gets the event listeners for the event target.
   *
   * @param type - Type of event to get the listeners for
   * @returns Event listeners for the event target
   */
  getEventListeners(type: EventType): ListenerFn[] | undefined {
    return this.listenersMap.get(type);
  }

  /**
   * Removes an event listener from the event target.
   *
   * @param type - Type of event to remove the listener for
   * @param callback - Function to remove the listener for
   */
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

  /**
   * Removes all event listeners from the event target.
   */
  removeAllListeners(): void {
    this.listenersMap.clear();
  }

  private handleEvent(type: EventType, payload?: Record<string, unknown>): void {
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

      const listeners = target.getEventListeners(type) as ListenerFn[];
      listeners?.forEach((listener) => listener(event));

      target = target.parent;
    }
  }

  /**
   * Dispatches an event to the event target.
   * 
   * Events are processed in the engine event queue at the beginning of each frame
   * in order that they were dispatched.
   *
   * @param type - Type of event to dispatch
   * @param payload - Payload of the event
   */
  dispatchEvent(type: EventType, payload?: Record<string, unknown>): void {
    eventQueue.add(this.handleEvent.bind(this, type, payload));
  }

  /**
   * Dispatches an event to the event target immediately.
   *
   * Events are processed immediately and not added to the engine event queue.
   *
   * @param type - Type of event to dispatch
   * @param payload - Payload of the event
   */
  dispatchEventImmediately(type: EventType, payload?: Record<string, unknown>): void {
    this.handleEvent(type, payload);
  }
}
