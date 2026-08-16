import type { FC, ReactElement } from 'react'
import { Typography } from 'antd'

import {
  FeatureLabelStyled,
  TitleCSS,
} from './feature-label.style'

interface LabelProps {
  title: string
  children: ReactElement | ReactElement[]
  className?: string
}

export const FeatureLabel: FC<LabelProps> = ({ title, children, className }) => (
  <FeatureLabelStyled className={className}>
    <Typography.Text css={TitleCSS}>{title}</Typography.Text>
    {children}
  </FeatureLabelStyled>
)
