import { FC } from 'react'

import { LabelledRangeInput } from '../../../range-input'
import type { RangeInputProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'

export const RangeField: FC<RangeInputProps & LabelledProps> = ({
  min = 0,
  max = 100,
  step = 1,
  ...props
}) => (
  <LabelledRangeInput
    min={min}
    max={max}
    step={step}
    {...props}
  />
)
