import { FC } from 'react'

import { LabelledFileInput } from '../../../file-input'
import type { InputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const FileField: FC<InputProps & LabelledProps> = (props) => (
  <LabelledFileInput {...props} />
)
