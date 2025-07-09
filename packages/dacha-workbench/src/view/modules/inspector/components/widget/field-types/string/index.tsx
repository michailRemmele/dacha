import { FC } from 'react'

import { LabelledTextInput } from '../../../text-input'
import type { InputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const StringField: FC<InputProps & LabelledProps> = (props) => (
  <LabelledTextInput {...props} />
)
