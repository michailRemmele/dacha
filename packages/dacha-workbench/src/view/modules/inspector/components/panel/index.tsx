import React, { FC } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import './style.less'

export interface PanelProps {
  children: JSX.Element | Array<JSX.Element | null> | null
  title: string
  onDelete: () => void
  className?: string
}

export const Panel: FC<PanelProps> = ({
  children,
  title,
  onDelete,
  className,
}) => (
  <div className={['panel', className].filter(Boolean).join(' ')}>
    <header className="panel__heading">
      <span>
        {title}
      </span>
      <Button icon={<DeleteOutlined />} size="small" onClick={onDelete} />
    </header>
    <div className="panel__content">
      {children}
    </div>
  </div>
)
