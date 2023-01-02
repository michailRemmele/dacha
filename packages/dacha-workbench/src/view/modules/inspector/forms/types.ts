import type { FC } from 'react'

export interface FormComponentProps {
  path: Array<string>
}

export type FormComponent = FC<FormComponentProps>
