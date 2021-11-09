import { Component } from '../../../engine/component';
import { InputEventsConfig, InputEventBindings } from '../../types';

export class MouseControl extends Component {
  inputEventBindings: InputEventBindings;

  constructor(componentName: string, config: InputEventsConfig) {
    super(componentName);

    this.inputEventBindings = config.inputEventBindings;
  }

  clone() {
    return new MouseControl(this.componentName, {
      inputEventBindings: Object.keys(this.inputEventBindings).reduce(
        (acc: InputEventBindings, key) => {
          acc[key] = {
            messageType: this.inputEventBindings[key].messageType,
            attrs: {
              ...this.inputEventBindings[key].attrs,
            },
          };
          return acc;
        }, {},
      ),
    });
  }
}
