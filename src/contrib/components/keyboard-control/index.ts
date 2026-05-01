import { Component } from '../../../engine/component';
import type {
  InputEventAttributes,
  InputEventAttributeConfig,
} from '../../types';

export interface KeyboardEventBind {
  eventType: string;
  attrs: InputEventAttributes;
  keepEmit: boolean;
}

export type InputEventBindings = Record<
  string,
  {
    pressed?: KeyboardEventBind;
    released?: KeyboardEventBind;
  }
>;

export interface KeyboardEventBindConfig {
  key: string;
  pressed: boolean;
  keepEmit?: boolean;
  eventType: string;
  attrs: InputEventAttributeConfig[];
}

export interface KeyboardControlConfig extends Record<string, unknown> {
  inputEventBindings: KeyboardEventBindConfig[];
}

/**
 * KeyboardControl component for handling keyboard input events.
 *
 * KeyboardControl component handles the keyboard input events for an actor.
 * It can be used to bind keyboard events to game actions.
 *
 * @example
 * ```typescript
 * // Create a keyboard control
 * const keyboardControl = new KeyboardControl({
 *   inputEventBindings: [
 *     {
 *       key: 'KeyW',
 *       pressed: true,
 *       keepEmit: true,
 *       eventType: 'RUN',
 *       attrs: [
 *         {
 *           name: 'angle',
 *           type: 'number',
 *           value: 270,
 *         },
 *       ],
 *     },
 *   ],
 * });
 *
 * // Add to actor
 * actor.setComponent(keyboardControl);
 * ```
 *
 * @category Components
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
