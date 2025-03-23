import { useCallback, FC } from 'react'
import type { ReactNode } from 'react'
import { Slider } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { RangeInputProps } from '../../../../../types/inputs'

import { InputRangeCSS, TooltipStyled } from './range-input.style'

const tooltip = {
  formatter: (value: number | undefined): ReactNode => (
    <TooltipStyled>{value}</TooltipStyled>
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
      css={InputRangeCSS}
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
