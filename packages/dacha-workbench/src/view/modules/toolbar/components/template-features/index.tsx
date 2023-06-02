import React, { FC } from 'react'

import type { ToolFeaturesProps } from '../types'

import {
  GridFeature,
  TemplateFeature,
  PreviewFeature,
} from './components'
import {
  GRID_FEATURE_NAME,
  TEMPLATE_FEATURE_NAME,
  PREVIEW_FEATURE_NAME,
} from './consts'

import './style.less'

export const TemplateFeatures: FC<ToolFeaturesProps> = ({ features }) => (
  <div className="tool-features">
    <PreviewFeature value={features[PREVIEW_FEATURE_NAME] as boolean} />
    <GridFeature value={features[GRID_FEATURE_NAME] as boolean} />
    <TemplateFeature value={features[TEMPLATE_FEATURE_NAME] as string} />
  </div>
)
