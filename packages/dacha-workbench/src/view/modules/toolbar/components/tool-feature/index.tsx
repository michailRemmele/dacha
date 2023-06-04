import type { FC } from 'react'

import { ToolFeatureStyled } from './tool-feature.style'

interface ToolFeatureProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ToolFeature: FC<ToolFeatureProps> = ({ children }) => (
  <ToolFeatureStyled>
    {children}
  </ToolFeatureStyled>
)
