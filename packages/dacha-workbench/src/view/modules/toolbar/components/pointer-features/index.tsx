import type { FC } from 'react'

import { ToolFeaturesStyled } from '../../toolbar.style'
import type { ToolFeaturesProps } from '../types'

import { GridFeature, GRID_FEATURE_NAME } from '../grid-feature'

export const PointerFeatures: FC<ToolFeaturesProps> = ({ features }) => (
  <ToolFeaturesStyled>
    <GridFeature value={features[GRID_FEATURE_NAME] as boolean} />
  </ToolFeaturesStyled>
)
