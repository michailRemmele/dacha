/**
 * The value of one attribute of an input binding.
 *
 * @category Input
 */
export type AttributeValue = string | number | boolean | string[];

/**
 * The attributes of an input binding, by name. The control systems put them in
 * the payload of the bound event.
 *
 * @category Input
 */
export type InputEventAttributes = Record<string, AttributeValue>;

/**
 * One attribute of an input binding, as the configuration stores it.
 *
 * @category Input
 */
export interface InputEventAttributeConfig {
  /** The name of the field in the event payload. */
  name: string;
  /** The type of the value. The editor uses it to show the right input. */
  type?: string;
  /** The value of the field. */
  value: AttributeValue;
}

/**
 * The payload of {@link MouseInputEvent} and of the events that
 * {@link MouseControlSystem} dispatches.
 *
 * @category Input
 */
export interface CustomMouseEvent {
  /** The browser event type, such as `mousedown` or `mousemove`. */
  eventType: string;
  /** The mouse button: `0` is left, `1` is middle, `2` is right. */
  button: number;
  /** The pointer position in world coordinates. */
  x: number;
  /** The pointer position in world coordinates. */
  y: number;
  /** The pointer position in pixels, relative to the window element. */
  screenX: number;
  /** The pointer position in pixels, relative to the window element. */
  screenY: number;
  /** The browser event. */
  nativeEvent: MouseEvent;
}

/**
 * The payload of {@link KeyboardInputEvent}.
 *
 * @category Input
 */
export interface CustomKeyboardEvent {
  /** The key, as `KeyboardEvent.code`: `KeyW`, `Space`, `ArrowUp`. */
  key: string;
  /** `true` when the key goes down, `false` when it goes up. */
  pressed: boolean;
  /** The browser event. */
  nativeEvent: KeyboardEvent;
}
