import { FC } from 'react'

import { LabelledNumberInput } from '../../../number-input'
import type { NumberInputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const NumberField: FC<NumberInputProps & LabelledProps> = (props) => (
  <LabelledNumberInput {...props} />
)
