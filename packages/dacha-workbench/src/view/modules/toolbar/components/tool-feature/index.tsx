import type { FC, ReactElement } from 'react'

import { ToolFeatureStyled } from './tool-feature.style'

interface ToolFeatureProps {
  children: ReactElement | ReactElement[]
}

export const ToolFeature: FC<ToolFeatureProps> = ({ children }) => (
  <ToolFeatureStyled>
    {children}
  </ToolFeatureStyled>
)
