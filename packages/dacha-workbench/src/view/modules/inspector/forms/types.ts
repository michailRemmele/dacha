import type { FC } from 'react'

export interface FormComponentProps {
  path: Array<string>
  entity: unknown
}

export type FormComponent = FC<FormComponentProps>
