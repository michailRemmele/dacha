import { useCallback, useMemo, FC } from 'react'
import { Select as AntdSelect } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { MultiSelectProps } from '../../../../../types/inputs'

import { SelectCSS } from './multi-select.style'

export const MultiSelect: FC<MultiSelectProps> = ({
  options = [],
  onChange = (): void => void 0,
  onBlur = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  ...props
}) => {
  const handleChange = useCallback((values: string[]) => onChange(values), [onChange])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onAccept()
    onBlur(event)
  }, [onBlur, onAccept])

  const selectOptions = useMemo(() => options.map((option) => (typeof option === 'object'
    ? { value: option.value, label: option.title, disabled: option.disabled }
    : { value: option, label: option })), [options])

  return (
    <AntdSelect
      css={SelectCSS}
      mode="multiple"
      onChange={handleChange}
      onBlur={handleBlur}
      options={selectOptions}
      {...props}
    />
  )
}

export const LabelledMultiSelect: FC<MultiSelectProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <MultiSelect {...props} />
  </Labelled>
)
