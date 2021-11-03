export interface InputEventBindings {
  [key: string]: {
    messageType: string
    attrs: Record<string, unknown>
  }
}

export interface InputEventsConfig {
  inputEventBindings: InputEventBindings
}
