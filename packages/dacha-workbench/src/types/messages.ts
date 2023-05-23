import type { Message } from 'remiz'

export interface SelectLevelMessage extends Message {
  levelId: string
}

export interface InspectEntityMessage extends Message {
  path: Array<string> | undefined
}

export interface SelectToolMessage extends Message {
  name: string
}

export interface MouseInputMessage extends Message {
  screenX: number
  screenY: number
  x: number
  y: number
}
