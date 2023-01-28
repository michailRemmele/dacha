export type InputEventAttributes = Record<string, string | number | boolean>;

export interface InputEventBind {
  event: string
  messageType: string
  attrs: InputEventAttributes
}

export interface InputEventBindings {
  [key: string]: Omit<InputEventBind, 'event'>
}

export interface InputEventAttributeConfig {
  name: string
  value: string | number | boolean
}
