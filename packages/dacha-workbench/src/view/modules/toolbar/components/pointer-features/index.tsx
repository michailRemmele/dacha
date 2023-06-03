import React, { FC } from 'react'

import type { ToolFeaturesProps } from '../types'

import { GridFeature, GRID_FEATURE_NAME } from '../grid-feature'

export const PointerFeatures: FC<ToolFeaturesProps> = ({ features }) => (
  <div className="tool-features">
    <GridFeature value={features[GRID_FEATURE_NAME] as boolean} />
  </div>
)
