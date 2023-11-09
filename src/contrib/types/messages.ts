import type { Message } from '../../engine/message-bus';

export interface MouseInputEvent {
  eventType: string
  button: number
  x: number
  y: number
  screenX: number
  screenY: number
}

export type MouseInputMessage = Message & MouseInputEvent;

export interface KeyboardInputEvent {
  key: string
  pressed: boolean
}

export type KeyboardInputMessage = Message & KeyboardInputEvent;
