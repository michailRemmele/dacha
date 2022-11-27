import type { FC } from 'react'

import type { Extension } from './global'
import type { Data } from '../view/utils/get'
import type { Field as RCField } from '../view/modules/inspector/components/field'
import type { TextInput, LabelledTextInput } from '../view/modules/inspector/components/text-input'
import type { NumberInput, LabelledNumberInput } from '../view/modules/inspector/components/number-input'
import type { Select, LabelledSelect } from '../view/modules/inspector/components/select'
import type { Checkbox, LabelledCheckbox } from '../view/modules/inspector/components/checkbox'

export type DependencyValue = string | number | boolean

export interface Dependency {
  name: string
  value: DependencyValue
}

export interface ReferenceItem {
  title: string
  value: string
}

export interface Reference {
  items: Array<ReferenceItem>
}

export type References = Record<string, Reference | undefined>

export type FieldType = 'string' | 'number' | 'boolean' | 'select'

export interface Field {
  name: string
  title: string
  type: FieldType
  referenceId?: string
  dependency?: Dependency
}

export interface WidgetProps {
  fields: Array<Field>
  references?: References
  path: Array<string>
}

export interface WidgetViewProps extends WidgetProps {
  context: {
    extension: Extension
    projectConfig: Data
  }
  components: {
    Widget: FC<WidgetProps>
    Field: typeof RCField
    TextInput: typeof TextInput
    LabelledTextInput: typeof LabelledTextInput
    NumberInput: typeof NumberInput
    LabelledNumberInput: typeof LabelledNumberInput
    Select: typeof Select
    LabelledSelect: typeof LabelledSelect
    Checkbox: typeof Checkbox
    LabelledCheckbox: typeof LabelledCheckbox
  }
  utils: {
    get: (data: Data, path: Array<string>) => unknown
  }
}

export interface WidgetPartSchema {
  fields: Array<Field>
  references?: References
}

export interface WidgetSchema {
  title: string
  fields?: Array<Field>
  references?: References
  view?: FC<WidgetViewProps>
}
