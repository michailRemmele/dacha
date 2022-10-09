import React, { FC } from 'react'

import './style.less'

export interface LabelledProps {
  label: string
  children: JSX.Element
}

export const Labelled: FC<LabelledProps> = ({ label, children }) => (
  // comment: associated control is a react children
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className="labelled">
    <span className="labelled__label">
      {label}
    </span>
    {children}
  </label>
)
