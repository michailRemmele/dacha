import type { FC } from 'react'
import { ZoomFeatures } from './zoom-features'
import { TemplatesFeatures } from './template-features'

import type { ToolFeaturesProps } from './types'

export const features: Record<string, FC<ToolFeaturesProps>> = {
  zoom: ZoomFeatures,
  template: TemplatesFeatures,
}
