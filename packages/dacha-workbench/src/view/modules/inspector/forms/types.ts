import type { FC } from 'react'

export interface FormComponentProps {
  path: string[]
}

export type FormComponent = FC<FormComponentProps>
