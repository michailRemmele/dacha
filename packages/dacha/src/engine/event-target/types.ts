import type { EventTarget } from './event-target';

/**
 * The name of an event.
 *
 * @category Events
 */
export type EventType = string | symbol;

/**
 * Event interface.
 * 
 * @category Events
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

/** @inline */
type EventField = 'type' | 'target' | 'currentTarget' | 'stopPropagation';

/**
 * A listener for an event without a known type.
 *
 * @category Events
 */
export type ListenerFn = (event: Event) => void;

/**
 * The payload argument of `dispatchEvent` for event `K` in event map `T`. It is
 * the event type without the fields the engine sets: `type`, `target`,
 * `currentTarget` and `stopPropagation`. The argument is optional when the event
 * has no payload.
 *
 * @category Events
 */
export type EventPayload<T, K> = K extends keyof T
  ? Record<string, never> extends Omit<T[K], EventField>
    ? [Omit<T[K], EventField>?]
    : [Omit<T[K], EventField>]
  : [Record<string, unknown>?];
