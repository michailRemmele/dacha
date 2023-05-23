import React, { FC } from 'react'

import './style.less'

interface ToolFeatureProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ToolFeature: FC<ToolFeatureProps> = ({ children }) => (
  <div className="tool-features__feature">
    {children}
  </div>
)
