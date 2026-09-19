import type { ActorEvent } from 'dacha';

export const Move = 'Move';

export type MoveEvent = ActorEvent<{ x: number; y: number }>;

declare module 'dacha' {
  export interface ActorEventMap {
    [Move]: MoveEvent;
  }
}
