import React, { useCallback, FC } from 'react'
import { Select as AntdSelect } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { MultiSelectProps } from '../../../../../types/inputs'

import './style.less'

export const MultiSelect: FC<MultiSelectProps> = ({
  options = [],
  onChange,
  defaultValue,
  onSelect,
  ...props
}) => {
  const handleChange = useCallback((values: Array<string>) => onChange(values), [onChange])

  return (
    <AntdSelect
      className="multi-select"
      size="small"
      mode="multiple"
      onChange={handleChange}
      {...props}
    >
      {options.map((option) => (
        <AntdSelect.Option key={option.value} value={option.value} disabled={option.disabled}>
          {option.title}
        </AntdSelect.Option>
      ))}
    </AntdSelect>
  )
}

export const LabelledMultiSelect: FC<MultiSelectProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <MultiSelect {...props} />
  </Labelled>
)
