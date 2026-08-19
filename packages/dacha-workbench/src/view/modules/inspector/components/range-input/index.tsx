import { useCallback, FC } from 'react'
import type { ReactNode } from 'react'
import { Slider } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { RangeInputProps } from '../../../../../types/inputs'

import styles from './range-input.module.css'

const tooltip = {
  formatter: (value: number | undefined): ReactNode => (
    <div className={styles.tooltip}>{value}</div>
  ),
}

export const RangeInput: FC<RangeInputProps> = ({
  onChange = (): void => void 0,
  onAccept = (): void => void 0,
  ...props
}) => {
  const handleChange = useCallback(
    (value: number | null) => onChange(value as number),
    [onChange],
  )

  return (
    <Slider
      classNames={{
        root: styles.slider,
        rail: styles.rail,
        track: styles.track,
      }}
      range={false}
      onChange={handleChange}
      onAfterChange={onAccept}
      tooltip={tooltip}
      {...props}
    />
  )
}

export const LabelledRangeInput: FC<RangeInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <RangeInput {...props} />
  </Labelled>
)
