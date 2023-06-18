export type AttributeValue = string | number | boolean | Array<string>;

export type InputEventAttributes = Record<string, AttributeValue>;

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
  value: AttributeValue
}
