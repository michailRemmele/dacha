import React, { FC } from 'react'

import type { ToolFeaturesProps } from '../types'

import {
  StepFeature,
  TemplateFeature,
  PreviewFeature,
} from './components'
import {
  STEP_FEATURE_NAME,
  TEMPLATE_FEATURE_NAME,
  PREVIEW_FEATURE_NAME,
} from './consts'

export const TemplateFeatures: FC<ToolFeaturesProps> = ({ features }) => (
  <div className="tool-features">
    <PreviewFeature value={features[PREVIEW_FEATURE_NAME] as boolean} />
    <StepFeature value={features[STEP_FEATURE_NAME] as number} />
    <TemplateFeature value={features[TEMPLATE_FEATURE_NAME] as string} />
  </div>
)
