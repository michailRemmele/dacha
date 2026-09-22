import { Component } from '../../../engine/component';
import type {
  InputEventAttributes,
  InputEventAttributeConfig,
} from '../../types';

/**
 * A keyboard binding as {@link KeyboardControl} stores it at runtime.
 *
 * @category Input
 */
export interface KeyboardEventBind {
  /** The name of the event to dispatch on the actor. */
  eventType: string;
  /** Values to put in the event payload. */
  attrs: InputEventAttributes;
  /** Sends the event again in every frame while the key is held. */
  keepEmit: boolean;
}

/** @inline */
export type InputEventBindings = Record<
  string,
  {
    pressed?: KeyboardEventBind;
    released?: KeyboardEventBind;
  }
>;

/**
 * One keyboard binding in the configuration.
 *
 * @see [Keyboard control](https://dachajs.org/systems/input/#keyboard-control)
 *
 * @category Input
 */
export interface KeyboardEventBindConfig {
  /** The key, as `KeyboardEvent.code`: `KeyW`, `Space`, `ArrowUp`. */
  key: string;
  /**
   * `true` sends the event when the key goes down. `false` sends it when the
   * key goes up.
   */
  pressed: boolean;
  /**
   * Sends the event again in every frame while the key is held. Only for
   * `pressed` bindings.
   */
  keepEmit?: boolean;
  /** The name of the event to dispatch on the actor. */
  eventType: string;
  /** Values to put in the event payload. */
  attrs: InputEventAttributeConfig[];
}

/**
 * Options for {@link KeyboardControl}.
 *
 * @category Input
 */
export interface KeyboardControlConfig extends Record<string, unknown> {
  /** The keyboard bindings of the actor. */
  inputEventBindings: KeyboardEventBindConfig[];
}

/**
 * Binds keys to events on the actor. {@link KeyboardControlSystem} dispatches
 * the bound event when the key goes down or up.
 *
 * @see [Keyboard control](https://dachajs.org/systems/input/#keyboard-control)
 *
 * @category Input
 */
export class KeyboardControl extends Component {
  /** Input event bindings */
  inputEventBindings: InputEventBindings;

  /**
   * Creates a new KeyboardControl component.
   *
   * @param config - Configuration for the keyboard control
   */
  constructor(config: KeyboardControlConfig) {
    super();

    const { inputEventBindings } = config;

    this.inputEventBindings = inputEventBindings.reduce(
      (acc: InputEventBindings, bind) => {
        acc[bind.key] ??= {};

        acc[bind.key][bind.pressed ? 'pressed' : 'released'] = {
          eventType: bind.eventType,
          keepEmit: !!bind.keepEmit,
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

KeyboardControl.componentName = 'KeyboardControl';
