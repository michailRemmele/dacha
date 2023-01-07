export interface InputEventBind {
  event: string
  messageType: string
  attrs: Record<string, unknown>
}

export interface InputEventBindings {
  [key: string]: Omit<InputEventBind, 'event'>
}

export interface InputEventsConfig extends Record<string, unknown> {
  inputEventBindings: Array<InputEventBind>
}
