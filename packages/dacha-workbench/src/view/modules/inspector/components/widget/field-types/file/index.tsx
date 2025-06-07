import { FC } from 'react'

import { LabelledFileInput } from '../../../file-input'
import type { FileInputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const FileField: FC<FileInputProps & LabelledProps> = (props) => (
  <LabelledFileInput {...props} />
)
