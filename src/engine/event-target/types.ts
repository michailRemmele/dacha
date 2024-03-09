import type { EventTarget } from './event-target';

export type EventType = string | symbol;

export interface Event<T = EventTarget> {
  type: EventType
  target: T
  currentTarget: EventTarget
  stopPropagation: () => void
}

type EventField = 'type' | 'target' | 'currentTarget' | 'stopPropagation';

export type ListenerFn = (event: Event) => void;

export type EventPayload<T, K> = K extends keyof T
  ? Record<string, never> extends Omit<T[K], EventField> ? [undefined?] : [Omit<T[K], EventField>]
  : [Record<string, unknown>?];
