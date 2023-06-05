import { useCallback, FC, ReactElement } from 'react'
import { Select as AntdSelect } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { MultiTextInputProps } from '../../../../../types/inputs'

import { SelectCSS } from './multi-text-input.style'

export const MultiTextInput: FC<MultiTextInputProps> = ({
  onChange = (): void => void 0,
  onBlur = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  ...props
}) => {
  const handleChange = useCallback((values: Array<string>) => onChange(values), [onChange])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onAccept()
    onBlur(event)
  }, [onBlur, onAccept])

  const dropdownRender = useCallback(() => null as unknown as ReactElement, [])

  return (
    <AntdSelect
      css={SelectCSS}
      tokenSeparators={[' ', ',']}
      size="small"
      mode="tags"
      onChange={handleChange}
      onBlur={handleBlur}
      dropdownRender={dropdownRender}
      showArrow={false}
      open={false}
      {...props}
    />
  )
}

export const LabelledMultiTextInput: FC<MultiTextInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <MultiTextInput {...props} />
  </Labelled>
)
