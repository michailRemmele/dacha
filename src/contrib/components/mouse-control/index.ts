import { Component } from '../../../engine/component';
import type {
  InputEventBindings,
  InputEventAttributes,
  InputEventAttributeConfig,
} from '../../types';

export interface MouseEventBindConfig {
  event: string
  messageType: string
  attrs: Array<InputEventAttributeConfig>
}

export interface MouseControlConfig extends Record<string, unknown> {
  inputEventBindings: Array<MouseEventBindConfig>
}

export class MouseControl extends Component {
  inputEventBindings: InputEventBindings;

  constructor(config: Record<string, unknown>) {
    super();

    const { inputEventBindings } = config as MouseControlConfig;

    this.inputEventBindings = inputEventBindings.reduce((acc: InputEventBindings, bind) => {
      acc[bind.event] = {
        messageType: bind.messageType,
        attrs: bind.attrs.reduce((attrs: InputEventAttributes, attr) => {
          attrs[attr.name] = attr.value;
          return attrs;
        }, {}),
      };
      return acc;
    }, {});
  }

  clone(): MouseControl {
    return new MouseControl({
      inputEventBindings: Object.keys(this.inputEventBindings).map(
        (key) => ({
          event: key,
          messageType: this.inputEventBindings[key].messageType,
          attrs: Object.keys(this.inputEventBindings[key].attrs).map(
            (name) => ({ name, value: this.inputEventBindings[key].attrs[name] }),
          ),
        }),
      ),
    });
  }
}
