export interface FrameFieldConfig {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  value: string | number | boolean;
}

export interface FrameConfig {
  id: string;
  fields: FrameFieldConfig[];
}

export interface TimelineConfig {
  frames: FrameConfig[];
  looped: boolean;
}

export interface ComparatorConditionComponentValueConfig {
  type: string;
  value: string | string[];
}

export interface ComparatorConditionSimpleValueConfig {
  type: string;
  value: string | number | boolean;
}

export type OperationType =
  | 'equals'
  | 'notEquals'
  | 'greater'
  | 'less'
  | 'greaterOrEqual'
  | 'lessOrEqual';

export interface ComparatorConditionArg {
  type: 'string' | 'number' | 'boolean' | 'componentValue';
  [key: string]: unknown;
}

export interface ComparatorConditionPropsConfig {
  operation: OperationType;
  arg1: ComparatorConditionArg;
  arg2: ComparatorConditionArg;
}

export interface EventConditionPropsConfig {
  eventType: string;
}

export interface ConditionConfig {
  id: string;
  type: 'comparator' | 'event';
  props: Record<string, unknown>;
}

export interface TransitionConfig {
  id: string;
  state: string;
  time: number;
  conditions: ConditionConfig[];
}

export interface StateConfig {
  id: string;
  name: string;
  speed: number;
  type: 'individual' | 'group';
  transitions: TransitionConfig[];
}

export interface IndividualStateConfig extends StateConfig {
  timeline: TimelineConfig;
}

export interface SubstateConfig {
  id: string;
  name: string;
  timeline: TimelineConfig;
  x: number;
  y: number;
}

export interface OneDimensionalPropsConfig {
  x: string | string[];
}

export interface TwoDimensionalPropsConfig extends OneDimensionalPropsConfig {
  y: string | string[];
}

export interface GroupStateConfig extends StateConfig {
  substates: SubstateConfig[];
  pickMode: '1D' | '2D';
  pickProps: OneDimensionalPropsConfig | TwoDimensionalPropsConfig;
}

export interface AnimatableConfig extends Record<string, unknown> {
  states: unknown[];
  initialState: string;
}
