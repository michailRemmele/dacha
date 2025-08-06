import { FC } from 'react'

import { FormStyled } from './form.style'

export interface FormProps {
  children: JSX.Element | (JSX.Element | null)[] | null
}

export const Form: FC<FormProps> = ({ children }) => (
  <FormStyled>
    {children}
  </FormStyled>
)
