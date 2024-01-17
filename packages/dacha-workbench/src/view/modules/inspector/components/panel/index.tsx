import { FC } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import {
  PanelStyled,
  HeadingStyled,
  PanelContentStyled,
} from './panel.style'

export interface PanelProps {
  children: JSX.Element | Array<JSX.Element | null | undefined> | null | undefined
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
  <PanelStyled className={className}>
    <HeadingStyled>
      <span>
        {title}
      </span>
      <Button icon={<DeleteOutlined />} size="small" onClick={onDelete} />
    </HeadingStyled>
    <PanelContentStyled>
      {children}
    </PanelContentStyled>
  </PanelStyled>
)
