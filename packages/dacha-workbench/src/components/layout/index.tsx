import React, { FC } from 'react'

import './style.css'

interface LayoutProps {
  children: JSX.Element
}

export const Layout: FC<LayoutProps> = ({ children }): JSX.Element => (
  <div className="layout">
    {children}
  </div>
)
