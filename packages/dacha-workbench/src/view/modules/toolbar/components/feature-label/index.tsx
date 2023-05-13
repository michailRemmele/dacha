import React, { FC } from 'react'

import './style.less'

interface LabelProps {
  title: string
  children: JSX.Element | Array<JSX.Element>
}

export const FeatureLabel: FC<LabelProps> = ({ title, children }) => (
  // comment: associated control is a react children
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className="feature-label">
    <span className="feature-label__title">{title}</span>
    {children}
  </label>
)
