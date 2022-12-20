import { EngineContext } from './view/providers'
import { useExtension } from './view/hooks'
import { get } from './view/utils/get'
import { Field } from './view/modules/inspector/components/field'
import { Widget } from './view/modules/inspector/components/widget'
import { TextInput, LabelledTextInput } from './view/modules/inspector/components/text-input'
import { NumberInput, LabelledNumberInput } from './view/modules/inspector/components/number-input'
import { Select, LabelledSelect } from './view/modules/inspector/components/select'
import { Checkbox, LabelledCheckbox } from './view/modules/inspector/components/checkbox'
import { MultiField } from './view/modules/inspector/components/multi-field'
import { Panel } from './view/modules/inspector/components/panel'

window.RemizEditor = {
  EngineContext,

  Field,
  Widget,
  TextInput,
  LabelledTextInput,
  NumberInput,
  LabelledNumberInput,
  Select,
  LabelledSelect,
  Checkbox,
  LabelledCheckbox,
  MultiField,
  Panel,

  useExtension,

  get,
}
