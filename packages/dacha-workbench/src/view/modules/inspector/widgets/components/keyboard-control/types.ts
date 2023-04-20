export interface InputEventBind {
  id: string
  key: string
  event: string
}

export type InputEventBindings = Record<string, Omit<InputEventBind, 'event' | 'key'>>
