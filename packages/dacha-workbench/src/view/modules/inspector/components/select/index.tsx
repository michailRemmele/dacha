import { useCallback, useMemo, FC } from 'react'
import { Select as AntdSelect } from 'antd'
import { useTranslation } from 'react-i18next'

import { Labelled, LabelledProps } from '../labelled'
import type { SelectProps } from '../../../../../types/inputs'
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts'

import { cx } from '../../../../../utils/cx'

import * as styles from './select.module.css'

const NONE_VALUE = ''

export const Select: FC<SelectProps> = ({
  options = [],
  allowEmpty,
  value,
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  className,
  ...props
}) => {
  const { t } = useTranslation(NAMESPACE_EDITOR)
  const handleChange = useCallback((newValue: string) => {
    onChange(allowEmpty && newValue === NONE_VALUE ? null : newValue)
    onAccept()
  }, [onChange, onAccept, allowEmpty])

  const selectOptions = useMemo(() => {
    const items = options.map((option) => (typeof option === 'object'
      ? { value: option.value, label: option.title, disabled: option.disabled }
      : { value: option, label: option }))

    return allowEmpty
      ? [
        { value: NONE_VALUE, label: t('inspector.components.select.option.none.title') },
        ...items,
      ]
      : items
  }, [options, allowEmpty, t])

  return (
    <AntdSelect
      className={cx(styles.select, className)}
      onChange={handleChange}
      options={selectOptions}
      value={value ?? NONE_VALUE}
      {...props}
    />
  )
}

export const LabelledSelect: FC<SelectProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <Select {...props} />
  </Labelled>
)
