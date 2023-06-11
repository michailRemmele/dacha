import { FC } from 'react'

import {
  LabelledStyled,
  LabelStyled,
  InputStyled,
} from './labelled.style'

export interface LabelledProps {
  label: string
  children: JSX.Element
}

export const Labelled: FC<LabelledProps> = ({ label, children }) => (
  <LabelledStyled>
    <LabelStyled>
      {label}
    </LabelStyled>
    <InputStyled>
      {children}
    </InputStyled>
  </LabelledStyled>
)
