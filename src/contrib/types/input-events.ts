export type AttributeValue = string | number | boolean | Array<string>;

export type InputEventAttributes = Record<string, AttributeValue>;

export interface InputEventAttributeConfig {
  name: string
  value: AttributeValue
}
