import type { Message } from 'remiz'

export interface SelectLevelMessage extends Message {
  id: string
}

export interface InspectEntityMessage extends Message {
  path: Array<string>
}
