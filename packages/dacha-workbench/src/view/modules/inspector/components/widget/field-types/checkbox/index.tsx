import React, { FC } from 'react'

import { LabelledCheckbox } from '../../../checkbox'
import type { CheckboxProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const BooleanField: FC<CheckboxProps & LabelledProps> = (props) => (
  <LabelledCheckbox {...props} />
)
