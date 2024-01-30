export type EventType = string | symbol;

export interface Event<T> {
  type: EventType
  target: T
}

export type EventPayload<T, K> = K extends keyof T
  ? Record<string, never> extends Omit<T[K], 'type' | 'target'> ? [undefined?] : [Omit<T[K], 'type' | 'target'>]
  : [Record<string, unknown>?];

export type EventMap<T> = {
  [key in keyof T]: unknown
};

export type ListenerFn<T, U, K = EventType> = (
  event: K extends keyof T ? T[K] : Event<U>
) => void;
