import { Component } from '../../../engine/component';
import type {
  InputEventAttributes,
  InputEventAttributeConfig,
} from '../../types';

const MOUSE_BUTTONS_MAP = {
  mousedown: 0,
  mouseup: 0,
  mousemove: 0,
  click: 0,
  contextmenu: 2,
  dblclick: 0,
  mouseenter: 0,
  mouseleave: 0,
} as Record<string, number>;

export interface MouseEventBind {
  eventType: string
  attrs: InputEventAttributes
}

export interface InputEventBindings {
  [key: string]: {
    [button: string]: MouseEventBind
  }
}

export interface MouseEventBindConfig {
  event: string
  button?: number
  eventType: string
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
      acc[bind.event] ??= {};
      acc[bind.event][bind.button ?? MOUSE_BUTTONS_MAP[bind.event]] = {
        eventType: bind.eventType,
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
      inputEventBindings: Object.keys(this.inputEventBindings).reduce(
        (acc, inputEvent) => {
          const buttonBinds = this.inputEventBindings[inputEvent];

          Object.keys(buttonBinds).forEach((button) => {
            acc.push({
              event: inputEvent,
              button: Number(button),
              eventType: buttonBinds[button].eventType,
              attrs: Object.keys(buttonBinds[button].attrs).map(
                (name) => ({ name, value: buttonBinds[button].attrs[name] }),
              ),
            });
          });

          return acc;
        },
        [] as Array<MouseEventBindConfig>,
      ),
    });
  }
}

MouseControl.componentName = 'MouseControl';
