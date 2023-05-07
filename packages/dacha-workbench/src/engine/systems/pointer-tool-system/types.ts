import type { Message } from 'remiz'

export interface MouseInputMessage extends Message {
  screenX: number
  screenY: number
  x: number
  y: number
}
