import type { FC } from 'react'
import { ZoomFeatures } from './zoom-features'
import { TemplatesFeatures } from './template-features'

export const features: Record<string, FC> = {
  zoom: ZoomFeatures,
  template: TemplatesFeatures,
}
