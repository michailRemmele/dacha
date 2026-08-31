import { useCallback, FC } from 'react'
import { InputNumber } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { NumberInputProps } from '../../../../../types/inputs'

import { cx } from '../../../../../utils/cx'

import styles from './number-input.module.css'

export const NumberInput: FC<NumberInputProps> = ({
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  onBlur = (): void => void 0,
  className,
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
      className={cx(styles.inputNumber, className)}
      type="number"
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
