import type { HTMLProps } from 'react'

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size' | 'ref' | 'onChange'> {
  value: string
  onChange?: (value: string) => void
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

export interface MultiTextInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: Array<string>
  onChange?: (values: Array<string>) => void
}

export interface MultiSelectProps extends Omit<InputProps, 'value' | 'onChange'> {
  options: Array<SelectOption>
  value: Array<string>
  onChange?: (values: Array<string>) => void
}

export interface NumberInputProps extends Omit<InputProps, 'value' | 'onChange' | 'max' | 'min' | 'defaultValue' | 'onInput'> {
  value: number
  onChange?: (value: number) => void
}

export interface CheckboxProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: boolean
  onChange?: (value: boolean) => void
}

export interface ColorInputProps extends Omit<InputProps, 'defaultValue' | 'color'> {
  defaultValue: string
}

export interface FileInputProps extends InputProps {
  extensions?: Array<string>
}

export interface RangeInputProps extends Omit<InputProps, 'value' | 'onChange' | 'max' | 'min' | 'defaultValue' | 'step'> {
  value: number
  onChange?: (value: number) => void
  min: number
  max: number
  step: number
}
