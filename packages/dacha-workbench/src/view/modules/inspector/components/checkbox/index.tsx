import React, { useCallback, FC } from 'react'
import { Checkbox as AntdCheckbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

import { Labelled, LabelledProps } from '../labelled'
import type { CheckboxProps } from '../../../../../types/inputs'

export const Checkbox: FC<CheckboxProps> = ({
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  value,
  ...props
}) => {
  const handleChange = useCallback(
    (event: CheckboxChangeEvent) => {
      onChange(event.target.checked)
      onAccept()
    },
    [onChange, onAccept],
  )

  return (
    <AntdCheckbox
      onChange={handleChange}
      checked={value}
      {...props}
    />
  )
}

export const LabelledCheckbox: FC<CheckboxProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <Checkbox {...props} />
  </Labelled>
)
