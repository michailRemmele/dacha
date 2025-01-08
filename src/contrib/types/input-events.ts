export type AttributeValue = string | number | boolean | Array<string>;

export type InputEventAttributes = Record<string, AttributeValue>;

export interface InputEventAttributeConfig {
  name: string
  type?: string
  value: AttributeValue
}

export interface CustomMouseEvent {
  eventType: string
  button: number
  x: number
  y: number
  screenX: number
  screenY: number
  nativeEvent: MouseEvent
}

export interface CustomKeyboardEvent {
  key: string
  pressed: boolean
  nativeEvent: KeyboardEvent
}
