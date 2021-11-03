import { Component } from '../../../engine/component';
import { InputEventsConfig, InputEventBindings } from '../../types';

export class MouseControl extends Component {
  private _inputEventBindings: InputEventBindings;

  constructor(componentName: string, config: InputEventsConfig) {
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
