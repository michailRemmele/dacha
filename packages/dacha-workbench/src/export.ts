import { EngineContext, SchemasContext } from './view/providers'
import {
  useExtension,
  useConfig,
  useCommander,
  useStore,
  useBehaviors,
} from './view/hooks'
import { addValue, setValue, deleteValue } from './view/commands'
import { Field } from './view/modules/inspector/components/field'
import { DependencyField } from './view/modules/inspector/components/dependency-field'
import { Widget } from './view/modules/inspector/components/widget'
import { BehaviorWidget } from './view/modules/inspector/components/behavior-widget'
import { TextInput, LabelledTextInput } from './view/modules/inspector/components/text-input'
import { NumberInput, LabelledNumberInput } from './view/modules/inspector/components/number-input'
import { Select, LabelledSelect } from './view/modules/inspector/components/select'
import { Checkbox, LabelledCheckbox } from './view/modules/inspector/components/checkbox'
import { MultiTextInput, LabelledMultiTextInput } from './view/modules/inspector/components/multi-text-input'
import { MultiSelect, LabelledMultiSelect } from './view/modules/inspector/components/multi-select'
import { ColorInput, LabelledColorInput } from './view/modules/inspector/components/color-input'
import { FileInput, LabelledFileInput } from './view/modules/inspector/components/file-input'
import { MultiField } from './view/modules/inspector/components/multi-field'
import { Panel } from './view/modules/inspector/components/panel'
import {
  DefineSystem,
  DefineComponent,
  DefineField,
  DefineBehavior,
} from './view/modules/inspector/decorators'

const commands = {
  setValue,
  addValue,
  deleteValue,
}

window.DachaWorkbench = {
  EngineContext,
  SchemasContext,

  Field,
  DependencyField,
  Widget,
  BehaviorWidget,
  TextInput,
  LabelledTextInput,
  NumberInput,
  LabelledNumberInput,
  Select,
  LabelledSelect,
  Checkbox,
  LabelledCheckbox,
  MultiTextInput,
  LabelledMultiTextInput,
  MultiSelect,
  LabelledMultiSelect,
  ColorInput,
  LabelledColorInput,
  FileInput,
  LabelledFileInput,
  MultiField,
  Panel,

  DefineSystem,
  DefineComponent,
  DefineField,
  DefineBehavior,

  useExtension,
  useConfig,
  useCommander,
  useStore,
  useBehaviors,

  commands,
}
