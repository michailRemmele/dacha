import { Component } from '../../../engine/component';
import type {
  InputEventAttributes,
  InputEventAttributeConfig,
} from '../../types';

export interface KeyboardEventBind {
  messageType: string
  attrs: InputEventAttributes
  keepEmit: boolean
}

export interface InputEventBindings {
  [key: string]: {
    pressed?: KeyboardEventBind
    released?: KeyboardEventBind
  }
}

export interface KeyboardEventBindConfig {
  key: string
  pressed: boolean
  keepEmit?: boolean
  messageType: string
  attrs: Array<InputEventAttributeConfig>
}

export interface KeyboardControlConfig extends Record<string, unknown> {
  inputEventBindings: Array<KeyboardEventBindConfig>
}

export class KeyboardControl extends Component {
  inputEventBindings: InputEventBindings;

  constructor(config: Record<string, unknown>) {
    super();

    const { inputEventBindings } = config as KeyboardControlConfig;

    this.inputEventBindings = inputEventBindings.reduce((acc: InputEventBindings, bind) => {
      acc[bind.key] ??= {};

      acc[bind.key][bind.pressed ? 'pressed' : 'released'] = {
        messageType: bind.messageType,
        keepEmit: !!bind.keepEmit,
        attrs: bind.attrs.reduce((attrs: InputEventAttributes, attr) => {
          attrs[attr.name] = attr.value;
          return attrs;
        }, {}),
      };

      return acc;
    }, {});
  }

  clone(): KeyboardControl {
    return new KeyboardControl({
      inputEventBindings: Object.keys(this.inputEventBindings).reduce(
        (acc, inputEvent) => {
          const { pressed, released } = this.inputEventBindings[inputEvent];

          if (pressed !== undefined) {
            acc.push({
              key: inputEvent,
              messageType: pressed.messageType,
              pressed: true,
              keepEmit: pressed.keepEmit,
              attrs: Object.keys(pressed.attrs).map(
                (name) => ({ name, value: pressed.attrs[name] }),
              ),
            });
          }
          if (released !== undefined) {
            acc.push({
              key: inputEvent,
              messageType: released.messageType,
              pressed: false,
              attrs: Object.keys(released.attrs).map(
                (name) => ({ name, value: released.attrs[name] }),
              ),
            });
          }

          return acc;
        },
        [] as Array<KeyboardEventBindConfig>,
      ),
    });
  }
}

KeyboardControl.componentName = 'KeyboardControl';
