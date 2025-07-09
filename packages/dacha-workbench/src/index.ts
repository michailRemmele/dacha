import { addValue, setValue, deleteValue } from './view/commands'

export { EngineContext, SchemasContext } from './view/providers'
export {
  useExtension,
  useConfig,
  useCommander,
  useStore,
  useBehaviors,
} from './view/hooks'
export { defineWidget } from './hocs'
export { Field } from './view/modules/inspector/components/field'
export { DependencyField } from './view/modules/inspector/components/dependency-field'
export { Widget } from './view/modules/inspector/components/widget'
export { BehaviorWidget } from './view/modules/inspector/components/behavior-widget'
export { TextInput, LabelledTextInput } from './view/modules/inspector/components/text-input'
export { NumberInput, LabelledNumberInput } from './view/modules/inspector/components/number-input'
export { Select, LabelledSelect } from './view/modules/inspector/components/select'
export { Checkbox, LabelledCheckbox } from './view/modules/inspector/components/checkbox'
export { MultiTextInput, LabelledMultiTextInput } from './view/modules/inspector/components/multi-text-input'
export { MultiSelect, LabelledMultiSelect } from './view/modules/inspector/components/multi-select'
export { ColorInput, LabelledColorInput } from './view/modules/inspector/components/color-input'
export { FileInput, LabelledFileInput } from './view/modules/inspector/components/file-input'
export { MultiField } from './view/modules/inspector/components/multi-field'
export { Panel } from './view/modules/inspector/components/panel'

export const commands = {
  setValue,
  addValue,
  deleteValue,
}

export type { Data } from './store'

export type {
  WidgetSchema,
  WidgetProps,
  Field as WidgetField,
  FieldType,
  Dependency,
  DependencyValue,
} from './types/widget-schema'
