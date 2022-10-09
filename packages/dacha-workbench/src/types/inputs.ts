import type { HTMLProps } from 'react'

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size' | 'ref' | 'onChange'> {
  value: string
  onChange: (value: string) => void
}

export interface SelectOption {
  title: string
  value: string
}

export interface SelectProps extends InputProps {
  options: Array<SelectOption>
}
