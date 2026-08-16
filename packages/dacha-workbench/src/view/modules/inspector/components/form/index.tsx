import { FC, ReactElement } from 'react'

import { FormStyled } from './form.style'

export interface FormProps {
  children: ReactElement | (ReactElement | null)[] | null
}

export const Form: FC<FormProps> = ({ children }) => (
  <FormStyled>
    {children}
  </FormStyled>
)
