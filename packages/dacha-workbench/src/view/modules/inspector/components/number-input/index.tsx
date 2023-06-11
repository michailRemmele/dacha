import { useCallback, FC } from 'react'
import { InputNumber } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { NumberInputProps } from '../../../../../types/inputs'

import { InputNumberCSS } from './number-input.style'

export const NumberInput: FC<NumberInputProps> = ({
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  onBlur = (): void => void 0,
  ...props
}) => {
  const handleChange = useCallback(
    (value: number | null) => onChange(value as number),
    [onChange],
  )

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onAccept()
    onBlur(event)
  }, [onAccept, onBlur])

  return (
    <InputNumber
      css={InputNumberCSS}
      type="number"
      size="small"
      onChange={handleChange}
      onBlur={handleBlur}
      onPressEnter={onAccept}
      {...props}
    />
  )
}

export const LabelledNumberInput: FC<NumberInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <NumberInput {...props} />
  </Labelled>
)
