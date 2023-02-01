import type { HTMLProps } from 'react'

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size' | 'ref' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  onAccept?: () => void
}

export interface SelectOption {
  title: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends InputProps {
  options: Array<SelectOption>
  allowEmpty?: boolean
}

export interface MultiTextInputProps extends Omit<InputProps, 'value' | 'onChange' | 'onAccept'> {
  value: Array<string>
  onChange: (values: Array<string>) => void
  onAccept?: () => void
}

export interface MultiSelectProps extends Omit<InputProps, 'value' | 'onChange' | 'onAccept'> {
  options: Array<SelectOption>
  value: Array<string>
  onChange: (values: Array<string>) => void
  onAccept?: () => void
}

export interface NumberInputProps extends Omit<InputProps, 'value' | 'onChange' | 'onAccept' | 'max' | 'min' | 'defaultValue' | 'onInput'> {
  value: number
  onChange: (value: number) => void
  onAccept?: () => void
}

export interface CheckboxProps extends Omit<InputProps, 'value' | 'onChange' | 'onAccept'> {
  value: boolean
  onChange: (value: boolean) => void
  onAccept?: () => void
}
