import type { Message } from 'remiz'

export interface SelectLevelMessage extends Message {
  name: string
}

export interface InspectEntityMessage extends Message {
  path: Array<string>
}
