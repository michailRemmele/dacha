import { useCallback, FC } from 'react'
import { Select as AntdSelect } from 'antd'
import { useTranslation } from 'react-i18next'

import { Labelled, LabelledProps } from '../labelled'
import type { SelectProps } from '../../../../../types/inputs'

import { SelectCSS } from './select.style'

export const Select: FC<SelectProps> = ({
  options = [],
  allowEmpty,
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  ...props
}) => {
  const { t } = useTranslation()
  const handleChange = useCallback((value: string) => {
    onChange(value)
    onAccept()
  }, [onChange, onAccept])

  return (
    <AntdSelect
      css={SelectCSS}
      size="small"
      onChange={handleChange}
      {...props}
    >
      {allowEmpty && (
        <AntdSelect.Option key={0} value={null}>
          {t('inspector.components.select.option.none.title')}
        </AntdSelect.Option>
      )}
      {options.map((option) => (typeof option === 'object'
        ? (
          <AntdSelect.Option key={option.value} value={option.value} disabled={option.disabled}>
            {option.title}
          </AntdSelect.Option>
        )
        : (
          <AntdSelect.Option key={option} value={option}>
            {option}
          </AntdSelect.Option>
        )))}
    </AntdSelect>
  )
}

export const LabelledSelect: FC<SelectProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <Select {...props} />
  </Labelled>
)
