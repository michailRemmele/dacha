import { Component } from '../../../engine/component';
import { InputEventsConfig, InputEventBindings } from '../../types';

const PREFIX_SEPARATOR = '_';

export class KeyboardControl extends Component {
  private _inputEventBindings: InputEventBindings;
  private _keyStates: Record<string, string | null>;

  constructor(componentName: string, config: InputEventsConfig) {
    super(componentName);

    this._inputEventBindings = config.inputEventBindings;
    this._keyStates = Object
      .keys(this._inputEventBindings)
      .reduce((keyStates: Record<string, string | null>, inputEvent) => {
        const key = inputEvent.split(PREFIX_SEPARATOR)[0];
        if (key) {
          keyStates[key] = null;
        }
        return keyStates;
      }, {});
  }

  set inputEventBindings(inputEventBindings) {
    this._inputEventBindings = inputEventBindings;
  }

  get inputEventBindings() {
    return this._inputEventBindings;
  }

  set keyStates(keyStates) {
    this._keyStates = keyStates;
  }

  get keyStates() {
    return this._keyStates;
  }

  clone() {
    return new KeyboardControl(this.componentName, {
      inputEventBindings: {
        ...this.inputEventBindings,
      },
    });
  }
}
