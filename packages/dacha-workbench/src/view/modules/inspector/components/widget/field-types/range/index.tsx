import { FC } from 'react'

import { LabelledRangeInput } from '../../../range-input'
import type { RangeInputProps } from '../../../../../../../types/inputs'
import type { Properties } from '../../../../../../../types/widget-schema'
import type { LabelledProps } from '../../../labelled'

type FileFieldProps = {
  properties?: Properties
} & Omit<RangeInputProps, 'min' | 'max' | 'step'> & LabelledProps

export const RangeField: FC<FileFieldProps> = ({ properties, ...props }) => {
  const min = properties?.min as number ?? 0
  const max = properties?.max as number ?? 100
  const step = properties?.step as number ?? 1

  return (
    <LabelledRangeInput
      min={min}
      max={max}
      step={step}
      {...props}
    />
  )
}
