import { FC } from 'react'

import { LabelledMultiTextInput } from '../../../multi-text-input'
import type { MultiTextInputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

type MultiTextFieldProps = Omit<MultiTextInputProps, 'options'> & LabelledProps

export const MultiTextField: FC<MultiTextFieldProps> = ({ ...props }) => (
  <LabelledMultiTextInput {...props} />
)
