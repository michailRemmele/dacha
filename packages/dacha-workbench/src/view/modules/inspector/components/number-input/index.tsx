import React, { useCallback, FC } from 'react'
import { InputNumber } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { NumberInputProps } from '../../../../../types/inputs'

import './style.less'

export const NumberInput: FC<NumberInputProps> = ({ onChange, ...props }) => {
  const handleChange = useCallback(
    (value: number | null) => onChange(value as number),
    [onChange],
  )

  return (
    <InputNumber
      className="input-number"
      type="number"
      size="small"
      onChange={handleChange}
      {...props}
    />
  )
}

export const LabelledNumberInput: FC<NumberInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <NumberInput {...props} />
  </Labelled>
)
