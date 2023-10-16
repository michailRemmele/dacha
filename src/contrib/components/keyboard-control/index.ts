import { Component } from '../../../engine/component';
import type {
  InputEventBindings,
  InputEventAttributes,
  InputEventAttributeConfig,
} from '../../types';

const PREFIX_SEPARATOR = '_';

export interface KeyboardEventBindConfig {
  key: string
  event: string
  messageType: string
  attrs: Array<InputEventAttributeConfig>
}

export interface KeyboardControlConfig extends Record<string, unknown> {
  inputEventBindings: Array<KeyboardEventBindConfig>
}

export class KeyboardControl extends Component {
  inputEventBindings: InputEventBindings;
  keyStates: Record<string, string | null>;

  constructor(config: Record<string, unknown>) {
    super();

    const { inputEventBindings } = config as KeyboardControlConfig;

    this.inputEventBindings = inputEventBindings.reduce((acc: InputEventBindings, bind) => {
      acc[`${bind.key}${PREFIX_SEPARATOR}${bind.event}`] = {
        messageType: bind.messageType,
        attrs: bind.attrs.reduce((attrs: InputEventAttributes, attr) => {
          attrs[attr.name] = attr.value;
          return attrs;
        }, {}),
      };
      return acc;
    }, {});
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
    return new KeyboardControl({
      inputEventBindings: Object.keys(this.inputEventBindings).map(
        (inputEvent) => {
          const [key, event] = inputEvent.split(PREFIX_SEPARATOR);
          return {
            key,
            event,
            messageType: this.inputEventBindings[inputEvent].messageType,
            attrs: Object.keys(this.inputEventBindings[inputEvent].attrs).map(
              (name) => ({ name, value: this.inputEventBindings[inputEvent].attrs[name] }),
            ),
          };
        },
      ),
    });
  }
}

KeyboardControl.componentName = 'KeyboardControl';
