import { useCallback, useMemo, FC } from 'react'
import { Select as AntdSelect } from 'antd'
import { useTranslation } from 'react-i18next'

import { Labelled, LabelledProps } from '../labelled'
import type { SelectProps } from '../../../../../types/inputs'
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts'

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
  const { t } = useTranslation(NAMESPACE_EDITOR)
  const handleChange = useCallback((value: string) => {
    onChange(value)
    onAccept()
  }, [onChange, onAccept])

  const selectOptions = useMemo(() => {
    const items = options.map((option) => (typeof option === 'object'
      ? { value: option.value, label: option.title, disabled: option.disabled }
      : { value: option, label: option }))

    return allowEmpty
      ? [
        { value: null, label: t('inspector.components.select.option.none.title') },
        ...items,
      ]
      : items
  }, [options, allowEmpty, t])

  return (
    <AntdSelect
      css={SelectCSS}
      onChange={handleChange}
      options={selectOptions}
      {...props}
    />
  )
}

export const LabelledSelect: FC<SelectProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <Select {...props} />
  </Labelled>
)
