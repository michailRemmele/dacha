import React, { useCallback, FC, ChangeEvent } from 'react'
import { Input } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { InputProps } from '../../../../../types/inputs'

export const TextInput: FC<InputProps> = ({ onChange, ...props }) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  )

  return (
    <Input
      size="small"
      onChange={handleChange}
      {...props}
    />
  )
}

export const LabelledTextInput: FC<InputProps & LabelledProps> = ({ label, ...props }) => (
  <Labelled label={label}>
    <TextInput {...props} />
  </Labelled>
)
