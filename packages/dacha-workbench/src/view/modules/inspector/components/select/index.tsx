import React, { useCallback, FC } from 'react'
import { Select as AntdSelect } from 'antd'
import { useTranslation } from 'react-i18next'

import { Labelled, LabelledProps } from '../labelled'
import type { SelectProps } from '../../../../../types/inputs'

import './style.less'

export const Select: FC<SelectProps> = ({
  options = [],
  allowEmpty,
  onChange,
  defaultValue,
  onSelect,
  ...props
}) => {
  const { t } = useTranslation()
  const handleChange = useCallback((value: string) => onChange(value), [onChange])

  return (
    <AntdSelect
      className="select"
      size="small"
      onChange={handleChange}
      {...props}
    >
      {allowEmpty && (
        <AntdSelect.Option key={0} value={null}>
          {t('inspector.components.select.option.none.title')}
        </AntdSelect.Option>
      )}
      {options.map((option) => (
        <AntdSelect.Option key={option.value} value={option.value} disabled={option.disabled}>
          {option.title}
        </AntdSelect.Option>
      ))}
    </AntdSelect>
  )
}

export const LabelledSelect: FC<SelectProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <Select {...props} />
  </Labelled>
)
