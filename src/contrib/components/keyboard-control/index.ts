import { Component } from '../../../engine/component';
import { InputEventsConfig, InputEventBindings } from '../../types';

const PREFIX_SEPARATOR = '_';

export class KeyboardControl extends Component {
  inputEventBindings: InputEventBindings;
  keyStates: Record<string, string | null>;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const inputEventsConfig = config as InputEventsConfig;

    this.inputEventBindings = inputEventsConfig.inputEventBindings;
    this.keyStates = Object
      .keys(this.inputEventBindings)
      .reduce((keyStates: Record<string, string | null>, inputEvent) => {
        const key = inputEvent.split(PREFIX_SEPARATOR)[0];
        if (key) {
          keyStates[key] = null;
        }
        return keyStates;
      }, {});
  }

  clone(): KeyboardControl {
    return new KeyboardControl(this.componentName, {
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
