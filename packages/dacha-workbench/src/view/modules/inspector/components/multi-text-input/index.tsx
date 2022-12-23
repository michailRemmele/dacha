import React, { useCallback, FC, ReactElement } from 'react'
import { Select as AntdSelect } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { MultiTextInputProps } from '../../../../../types/inputs'

import './style.less'

export const MultiTextInput: FC<MultiTextInputProps> = ({
  onChange,
  defaultValue,
  onSelect,
  ...props
}) => {
  const handleChange = useCallback((values: Array<string>) => onChange(values), [onChange])

  const dropdownRender = useCallback(() => null as unknown as ReactElement, [])

  return (
    <AntdSelect
      className="multi-text-input"
      popupClassName="multi-text-input__popup multi-text-input__popup_hidden"
      tokenSeparators={[' ', ',']}
      size="small"
      mode="tags"
      onChange={handleChange}
      dropdownRender={dropdownRender}
      {...props}
    />
  )
}

export const LabelledMultiTextInput: FC<MultiTextInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <MultiTextInput {...props} />
  </Labelled>
)
