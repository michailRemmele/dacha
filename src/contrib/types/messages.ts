import type { Message } from '../../engine/message-bus';

export interface MouseInputEvent {
  eventType: string
  x: number
  y: number
  screenX: number
  screenY: number
}

export type MouseInputMessage = Message & MouseInputEvent;
