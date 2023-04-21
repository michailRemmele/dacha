import type { Message } from 'remiz'

export interface SelectLevelMessage extends Message {
  levelId: string
}

export interface InspectEntityMessage extends Message {
  path: Array<string> | undefined
}
