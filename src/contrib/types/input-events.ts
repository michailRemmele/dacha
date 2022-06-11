export interface InputEventBindings {
  [key: string]: {
    messageType: string
    attrs: Record<string, unknown>
  }
}

export type InputEventsConfig = {
  inputEventBindings: InputEventBindings
};
