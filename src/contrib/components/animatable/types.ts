export interface FrameFieldConfig {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean'
  value: string | number | boolean
}

export interface FrameConfig {
  id: string
  fields: Array<FrameFieldConfig>
}

export interface TimelineConfig {
  frames: Array<FrameConfig>
  looped: boolean
}

export interface ComparatorConditionComponentValueConfig {
  type: string
  value: string | Array<string>
}

export interface ComparatorConditionSimpleValueConfig {
  type: string
  value: string | number | boolean
}

export type OperationType = 'equals' | 'notEquals' | 'greater' | 'less' | 'greaterOrEqual' | 'lessOrEqual';

export interface ComparatorConditionArg {
  type: 'string' | 'number' | 'boolean' | 'componentValue'
  [key: string]: unknown
}

export interface ComparatorConditionPropsConfig {
  operation: OperationType
  arg1: ComparatorConditionArg
  arg2: ComparatorConditionArg
}

export interface EventConditionPropsConfig {
  eventType: string
}

export interface ConditionConfig {
  id: string
  type: 'comparator' | 'event'
  props: Record<string, unknown>
}

export interface TransitionConfig {
  id: string
  state: string
  time: number
  conditions: Array<ConditionConfig>
}

export interface StateConfig {
  id: string
  name: string
  speed: number
  type: 'individual' | 'group'
  transitions: Array<TransitionConfig>
}

export interface IndividualStateConfig extends StateConfig {
  timeline: TimelineConfig
}

export interface SubstateConfig {
  id: string
  name: string
  timeline: TimelineConfig
  x: number
  y: number
}

export interface OneDimensionalPropsConfig {
  x: string | Array<string>
}

export interface TwoDimensionalPropsConfig extends OneDimensionalPropsConfig {
  y: string | Array<string>
}

export interface GroupStateConfig extends StateConfig {
  substates: Array<SubstateConfig>
  pickMode: '1D' | '2D'
  pickProps: OneDimensionalPropsConfig | TwoDimensionalPropsConfig
}

export interface AnimatableConfig extends Record<string, unknown> {
  states: Array<unknown>
  initialState: string
}
