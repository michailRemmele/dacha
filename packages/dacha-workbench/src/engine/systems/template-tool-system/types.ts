import type { Message } from 'remiz'

export interface MouseInputMessage extends Message {
  screenX: number
  screenY: number
  x: number
  y: number
}

export interface Position {
  x: number | null
  y: number | null
}
