import React, { FC } from 'react'
import { RightOutlined } from '@ant-design/icons'

import { cn } from '../../../../utils/cn'

interface PanelExpandProps {
  isActive?: boolean
  children?: JSX.Element | Array<JSX.Element>
}

export const PanelExpand: FC<PanelExpandProps> = ({
  isActive,
  children,
}) => (
  <span className="collapse-panel__expand-extra">
    {children}
    <RightOutlined
      className={cn('collapse-panel__expand-arrow', isActive && 'collapse-panel__expand-arrow_active')}
    />
  </span>
)
