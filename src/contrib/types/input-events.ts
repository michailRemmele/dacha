export type AttributeValue = string | number | boolean | Array<string>;

export type InputEventAttributes = Record<string, AttributeValue>;

export interface InputEventAttributeConfig {
  name: string
  value: AttributeValue
}

export interface MouseEvent {
  eventType: string
  button: number
  x: number
  y: number
  screenX: number
  screenY: number
}

export interface KeyboardEvent {
  key: string
  pressed: boolean
}
