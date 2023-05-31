import type { Message } from 'remiz'

import type { SettingsConfig } from '../engine/components/settings'

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

export interface SetSettingsValueMessage extends Message {
  name: keyof SettingsConfig
  value: string | boolean | number
}
