import { Component } from '../../../engine/component';
import { InputEventsConfig, InputEventBindings } from '../../types';

export class MouseControl extends Component {
  inputEventBindings: InputEventBindings;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const inputEventsConfig = config as InputEventsConfig;

    this.inputEventBindings = inputEventsConfig.inputEventBindings;
  }

  clone(): MouseControl {
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
