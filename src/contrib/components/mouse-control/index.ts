import { Component } from '../../../engine/component';
import { InputEventsConfig, InputEventBindings } from '../../types';

export class MouseControl extends Component {
  inputEventBindings: InputEventBindings;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const { inputEventBindings } = config as InputEventsConfig;

    this.inputEventBindings = inputEventBindings.reduce((acc: InputEventBindings, bind) => {
      acc[bind.event] = {
        messageType: bind.messageType,
        attrs: bind.attrs,
      };
      return acc;
    }, {});
  }

  clone(): MouseControl {
    return new MouseControl(this.componentName, {
      inputEventBindings: Object.keys(this.inputEventBindings).map(
        (key) => ({
          event: key,
          messageType: this.inputEventBindings[key].messageType,
          attrs: {
            ...this.inputEventBindings[key].attrs,
          },
        }),
      ),
    });
  }
}
