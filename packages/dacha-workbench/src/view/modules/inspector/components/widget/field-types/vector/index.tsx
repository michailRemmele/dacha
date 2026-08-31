import { FC } from 'react'

import { LabelledVectorInput } from '../../../vector-input'
import type { VectorInputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const VectorField: FC<VectorInputProps & LabelledProps> = (props) => (
  <LabelledVectorInput {...props} />
)
