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
  eventType: string;
  attrs: InputEventAttributes;
}

export type InputEventBindings = Record<string, Record<string, MouseEventBind>>;

export interface MouseEventBindConfig {
  event: string;
  button?: number;
  eventType: string;
  attrs: InputEventAttributeConfig[];
}

export interface MouseControlConfig {
  inputEventBindings: MouseEventBindConfig[];
}

/**
 * MouseControl component for handling mouse input events.
 *
 * Handles the mouse input events for an actor.
 * It can be used to bind mouse events to game actions.
 *
 * @example
 * ```typescript
 * // Create a mouse control
 * const mouseControl = new MouseControl({
 *   inputEventBindings: [
 *     {
 *       event: 'mousedown',
 *       button: 0,
 *       eventType: 'ATTACK',
 *       attrs: [
 *         {
 *           name: 'type',
 *           type: 'string',
 *           value: 'lightAttack',
 *         },
 *       ],
 *     },
 *     {
 *       event: 'mousedown',
 *       button: 2,
 *       eventType: 'ATTACK',
 *       attrs: [
 *         {
 *           name: 'type',
 *           type: 'string',
 *           value: 'heavyAttack',
 *         },
 *       ],
 *     },
 *   ],
 * });
 * 
 * // Add to actor
 * actor.setComponent(mouseControl);
 * ```
 * 
 * @category Components
 */
export class MouseControl extends Component {
  /** Input event bindings */
  inputEventBindings: InputEventBindings;

  /**
   * Creates a new MouseControl component.
   * 
   * @param config - Configuration for the mouse control
   */
  constructor(config: MouseControlConfig) {
    super();

    const { inputEventBindings } = config;

    this.inputEventBindings = inputEventBindings.reduce(
      (acc: InputEventBindings, bind) => {
        acc[bind.event] ??= {};
        acc[bind.event][bind.button ?? MOUSE_BUTTONS_MAP[bind.event]] = {
          eventType: bind.eventType,
          attrs: bind.attrs.reduce((attrs: InputEventAttributes, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
          }, {}),
        };
        return acc;
      },
      {},
    );
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
              attrs: Object.keys(buttonBinds[button].attrs).map((name) => ({
                name,
                value: buttonBinds[button].attrs[name],
              })),
            });
          });

          return acc;
        },
        [] as MouseEventBindConfig[],
      ),
    });
  }
}

MouseControl.componentName = 'MouseControl';
