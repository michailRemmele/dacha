import { FC } from 'react'

import { ToolFeaturesStyled } from '../../toolbar.style'
import { GridFeature, GRID_FEATURE_NAME } from '../grid-feature'
import type { ToolFeaturesProps } from '../types'

import {
  TemplateFeature,
  PreviewFeature,
} from './components'
import {
  TEMPLATE_FEATURE_NAME,
  PREVIEW_FEATURE_NAME,
} from './consts'

export const TemplateFeatures: FC<ToolFeaturesProps> = ({ features }) => (
  <ToolFeaturesStyled>
    <PreviewFeature value={features[PREVIEW_FEATURE_NAME] as boolean} />
    <GridFeature value={features[GRID_FEATURE_NAME] as boolean} />
    <TemplateFeature value={features[TEMPLATE_FEATURE_NAME] as string} />
  </ToolFeaturesStyled>
)
