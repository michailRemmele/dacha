import type { HTMLProps } from 'react'

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size' | 'ref' | 'onChange'> {
  value: string
  onChange: (value: string) => void
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

export interface MultiTextInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: Array<string>
  onChange: (values: Array<string>) => void
}

export interface NumberInputProps extends Omit<InputProps, 'value' | 'onChange' | 'max' | 'min' | 'defaultValue' | 'onInput'> {
  value: number
  onChange: (value: number) => void
}

export interface CheckboxProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: boolean
  onChange: (value: boolean) => void
}
