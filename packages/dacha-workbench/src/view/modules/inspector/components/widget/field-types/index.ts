import type { FC } from 'react'

import { StringField } from './string'
import { NumberField } from './number'
import { SelectField } from './select'
import { BooleanField } from './checkbox'

export const fieldTypes: Record<string, FC<any>> = {
  string: StringField,
  number: NumberField,
  select: SelectField,
  boolean: BooleanField,
}
