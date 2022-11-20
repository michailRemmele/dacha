import React, { useCallback, FC } from 'react'
import { InputNumber } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { NumberInputProps } from '../../../../../types/inputs'

import './style.less'

export const NumberInput: FC<NumberInputProps> = ({ onChange, ...props }) => {
  const handleChange = useCallback(
    (value: number) => onChange(value),
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

export const LabelledNumberInput: FC<NumberInputProps & LabelledProps> = ({ label, ...props }) => (
  <Labelled label={label}>
    <NumberInput {...props} />
  </Labelled>
)
