import type { FC } from 'react'

import type { FieldType } from '../../../../../../types/widget-schema'

import { StringField } from './string'
import { NumberField } from './number'
import { SelectField } from './select'
import { BooleanField } from './checkbox'
import { MultiTextField } from './multi-text'
import { MultiSelectField } from './multi-select'
import { ColorField } from './color'
import { FileField } from './file'
import { RangeField } from './range'

// comment: TODO: Find the way to avoid using any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fieldTypes: Record<FieldType, FC<any>> = {
  string: StringField,
  number: NumberField,
  select: SelectField,
  boolean: BooleanField,
  multitext: MultiTextField,
  multiselect: MultiSelectField,
  color: ColorField,
  file: FileField,
  range: RangeField,
}
