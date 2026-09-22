/**
 * One field of a frame. When the frame plays, {@link Animator} writes `value` to
 * the path in `name`.
 */
export interface FrameFieldConfig {
  /** An identifier for the field. The editor creates it. */
  id: string;
  /**
   * The path to a value on the actor, with dots between the parts, such as
   * `components.Sprite.currentFrame`.
   */
  name: string;
  /** The type of the value. */
  type: 'string' | 'number' | 'boolean';
  /** The value to write. */
  value: string | number | boolean;
}

/**
 * One frame of a timeline. A frame sets only the fields it lists.
 */
export interface FrameConfig {
  /** An identifier for the frame. The editor creates it. */
  id: string;
  /** The fields the frame sets. */
  fields: FrameFieldConfig[];
}

/**
 * The frames of a state or a substate.
 */
export interface TimelineConfig {
  /** The frames, in the order they play. */
  frames: FrameConfig[];
  /**
   * Starts the timeline again after the last frame. Without it, the state stays
   * on the last frame.
   */
  looped: boolean;
}

/**
 * A comparator argument that reads a value on the actor.
 */
export interface ComparatorConditionComponentValueConfig {
  /** `componentValue`. */
  type: string;
  /** The path to the value, written like a frame field path. */
  value: string | string[];
}

/**
 * A comparator argument with a fixed value.
 */
export interface ComparatorConditionSimpleValueConfig {
  /** `number`, `string` or `boolean`. */
  type: string;
  /** The value. */
  value: string | number | boolean;
}

/**
 * The operation of a comparator condition.
 */
export type OperationType =
  | 'equals'
  | 'notEquals'
  | 'greater'
  | 'less'
  | 'greaterOrEqual'
  | 'lessOrEqual';

/**
 * One argument of a comparator condition.
 */
export interface ComparatorConditionArg {
  /**
   * The type of the argument. `componentValue` reads a value on the actor by
   * its path.
   */
  type: 'string' | 'number' | 'boolean' | 'componentValue';
  [key: string]: unknown;
}

/**
 * The `props` of a `comparator` condition. It compares two values.
 */
export interface ComparatorConditionPropsConfig {
  /** How to compare the values. */
  operation: OperationType;
  /** The first value. */
  arg1: ComparatorConditionArg;
  /** The second value. */
  arg2: ComparatorConditionArg;
}

/**
 * The `props` of an `event` condition. It becomes true when the actor itself
 * receives the event. Events dispatched on its children do not count.
 */
export interface EventConditionPropsConfig {
  /** The name of the event. */
  eventType: string;
}

/**
 * One condition of a transition.
 */
export interface ConditionConfig {
  /** An identifier for the condition. The editor creates it. */
  id: string;
  /** `comparator` compares two values. `event` waits for an event on the actor. */
  type: 'comparator' | 'event';
  /**
   * The settings of the condition: {@link ComparatorConditionPropsConfig} or
   * {@link EventConditionPropsConfig}.
   */
  props: Record<string, unknown>;
}

/**
 * A transition from one state to another. It fires when all its conditions are
 * true. If several transitions can fire, the first one in the list wins.
 */
export interface TransitionConfig {
  /** An identifier for the transition. The editor creates it. */
  id: string;
  /** The id of the state to switch to. */
  state: string;
  /**
   * When the transition can fire, in plays of the timeline. `0` means at any
   * moment. `1` means only after the timeline has played once.
   */
  time: number;
  /** The conditions. A transition without conditions fires as soon as `time` allows. */
  conditions: ConditionConfig[];
}

/**
 * Fields shared by individual and group states.
 */
export interface StateConfig {
  /** A unique id. Transitions and `initialState` refer to the state by it. */
  id: string;
  /** The name shown in the editor. */
  name: string;
  /**
   * Playback speed. At `1`, each frame lasts 0.1 seconds. At `2`, it lasts
   * 0.05 seconds. It must be above `0`.
   */
  speed: number;
  /** `individual` has one timeline. `group` picks one of several timelines. */
  type: 'individual' | 'group';
  /** The transitions to other states. */
  transitions: TransitionConfig[];
}

/**
 * A state with one timeline.
 */
export interface IndividualStateConfig extends StateConfig {
  /** The frames of the state. */
  timeline: TimelineConfig;
}

/**
 * One variant of a group state, with its own timeline.
 */
export interface SubstateConfig {
  /** An identifier for the substate. The editor creates it. */
  id: string;
  /** The name shown in the editor. */
  name: string;
  /** The frames of the substate. */
  timeline: TimelineConfig;
  /** The position of the substate on the first axis. */
  x: number;
  /** The position of the substate on the second axis. Only for `2D`. */
  y: number;
}

/**
 * The value a `1D` group state compares with its substates.
 */
export interface OneDimensionalPropsConfig {
  /** The path to the value on the actor, such as `components.Facing.x`. */
  x: string | string[];
}

/**
 * The values a `2D` group state compares with its substates.
 */
export interface TwoDimensionalPropsConfig extends OneDimensionalPropsConfig {
  /** The path to the second value on the actor. */
  y: string | string[];
}

/**
 * A state with several substates. {@link Animator} picks the substate closest to
 * the current values on the actor.
 */
export interface GroupStateConfig extends StateConfig {
  /** The variants of the state. */
  substates: SubstateConfig[];
  /** `1D` compares one value. `2D` compares two. */
  pickMode: '1D' | '2D';
  /** The paths to the values to compare. */
  pickProps: OneDimensionalPropsConfig | TwoDimensionalPropsConfig;
}

/**
 * Options for {@link Animatable}.
 */
export interface AnimatableConfig extends Record<string, unknown> {
  /** The states: {@link IndividualStateConfig} or {@link GroupStateConfig}. */
  states: unknown[];
  /** The id of the state the actor starts in. */
  initialState: string;
}
