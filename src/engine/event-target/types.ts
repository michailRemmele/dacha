import type { EventTarget } from './event-target';

export type EventType = string | symbol;

/**
 * Event interface.
 * 
 * @category Core
 */
export interface Event<T = EventTarget> {
  /** Type of the event */
  type: EventType
  /** Target of the event */
  target: T
  /** Current event target */
  currentTarget: EventTarget
  /** Function to stop the event propagation */
  stopPropagation: () => void
}

type EventField = 'type' | 'target' | 'currentTarget' | 'stopPropagation';

export type ListenerFn = (event: Event) => void;

export type EventPayload<T, K> = K extends keyof T
  ? Record<string, never> extends Omit<T[K], EventField>
    ? [Omit<T[K], EventField>?]
    : [Omit<T[K], EventField>]
  : [Record<string, unknown>?];
