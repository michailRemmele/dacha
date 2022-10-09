import React, { useCallback, FC } from 'react'
import { Select as AntdSelect } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { SelectProps } from '../../../../../types/inputs'

import './style.less'

export const Select: FC<SelectProps> = ({
  options = [],
  onChange,
  defaultValue,
  onSelect,
  ...props
}) => {
  const handleChange = useCallback((value: string) => onChange(value), [onChange])

  return (
    <AntdSelect
      className="select"
      size="small"
      onChange={handleChange}
      defaultValue={options[0] ? options[0].value : void ''}
      {...props}
    >
      {options.map((option) => (
        <AntdSelect.Option key={option.value} value={option.value}>
          {option.title}
        </AntdSelect.Option>
      ))}
    </AntdSelect>
  )
}

export const LabelledSelect: FC<SelectProps & LabelledProps> = ({ label, ...props }) => (
  <Labelled label={label}>
    <Select {...props} />
  </Labelled>
)
