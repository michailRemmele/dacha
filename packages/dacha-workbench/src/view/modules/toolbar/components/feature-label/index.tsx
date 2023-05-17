import React, { FC } from 'react'

import { cn } from '../../../../utils/cn'

import './style.less'

interface LabelProps {
  title: string
  children: JSX.Element | Array<JSX.Element>
  className?: string
}

export const FeatureLabel: FC<LabelProps> = ({ title, children, className }) => (
  // comment: associated control is a react children
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className={cn('feature-label', className)}>
    <span className="feature-label__title">{title}</span>
    {children}
  </label>
)
