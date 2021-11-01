import { Component } from '../../../engine/component';

interface InputEventBindings {
  [key: string]: {
    messageType: string
    attrs: Record<string, unknown>
  }
}

interface MouseControlConfig {
  inputEventBindings: InputEventBindings
}

export class MouseControl extends Component {
  private _inputEventBindings: InputEventBindings;

  constructor(componentName: string, config: MouseControlConfig) {
    super(componentName);

    this._inputEventBindings = config.inputEventBindings;
  }

  set inputEventBindings(inputEventBindings) {
    this._inputEventBindings = inputEventBindings;
  }

  get inputEventBindings() {
    return this._inputEventBindings;
  }

  clone() {
    return new MouseControl(this.componentName, {
      inputEventBindings: {
        ...this.inputEventBindings,
      },
    });
  }
}
