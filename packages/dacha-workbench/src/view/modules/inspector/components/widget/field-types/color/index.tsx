import { FC } from 'react'

import { LabelledColorInput } from '../../../color-input'
import type { ColorInputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const ColorField: FC<ColorInputProps & LabelledProps> = (props) => (
  <LabelledColorInput {...props} />
)
