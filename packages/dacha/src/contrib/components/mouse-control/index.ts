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

/**
 * A mouse binding as {@link MouseControl} stores it at runtime.
 *
 * @category Input
 */
export interface MouseEventBind {
  /** The name of the event to dispatch on the actor. */
  eventType: string;
  /** Values to put in the event payload. */
  attrs: InputEventAttributes;
}

/** @inline */
export type InputEventBindings = Record<string, Record<string, MouseEventBind>>;

/**
 * One mouse binding in the configuration.
 *
 * @see [Mouse control](https://dachajs.org/systems/input/#mouse-control)
 *
 * @category Input
 */
export interface MouseEventBindConfig {
  /**
   * The browser event: `mousedown`, `mouseup`, `mousemove`, `click`,
   * `contextmenu`, `dblclick`, `mouseenter` or `mouseleave`.
   */
  event: string;
  /**
   * The mouse button for `mousedown` and `mouseup`: `0` is left, `1` is middle,
   * `2` is right.
   */
  button?: number;
  /** The name of the event to dispatch on the actor. */
  eventType: string;
  /** Values to put in the event payload. */
  attrs: InputEventAttributeConfig[];
}

/**
 * Options for {@link MouseControl}.
 *
 * @category Input
 */
export interface MouseControlConfig {
  /** The mouse bindings of the actor. */
  inputEventBindings: MouseEventBindConfig[];
}

/**
 * Binds mouse events to events on the actor. {@link MouseControlSystem}
 * dispatches the bound event when the mouse event happens anywhere in the game
 * window. It does not check whether the pointer is over the actor.
 *
 * @see [Mouse control](https://dachajs.org/systems/input/#mouse-control)
 *
 * @category Input
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
}

MouseControl.componentName = 'MouseControl';
