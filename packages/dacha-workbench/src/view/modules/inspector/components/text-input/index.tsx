import React, { useCallback, FC, ChangeEvent } from 'react'
import { Input } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { InputProps } from '../../../../../types/inputs'

export const TextInput: FC<InputProps> = ({
  onChange,
  onAccept = (): void => void 0,
  onBlur = (): void => void 0,
  ...props
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  )

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onAccept()
    onBlur(event)
  }, [onAccept, onBlur])

  return (
    <Input
      size="small"
      onChange={handleChange}
      onBlur={handleBlur}
      onPressEnter={onAccept}
      {...props}
    />
  )
}

export const LabelledTextInput: FC<InputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <TextInput {...props} />
  </Labelled>
)
