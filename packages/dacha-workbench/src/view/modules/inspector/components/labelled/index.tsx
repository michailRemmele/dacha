import { FC, ReactElement } from 'react'

import {
  LabelledStyled,
  LabelStyled,
  InputStyled,
} from './labelled.style'

export interface LabelledProps {
  label: string
  children: ReactElement
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
