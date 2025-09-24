import { FC } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import {
  PanelStyled,
  HeadingStyled,
  PanelContentStyled,
  ButtonSmallCSS,
} from './panel.style'

export interface PanelProps {
  children: JSX.Element | (JSX.Element | null | undefined)[] | null | undefined
  title: string
  onDelete: () => void
  size?: 'small' | 'middle'
  className?: string
}

export const Panel: FC<PanelProps> = ({
  children,
  title,
  onDelete,
  size = 'middle',
  className,
}) => (
  <PanelStyled size={size} className={className}>
    <HeadingStyled size={size} contentless={!children}>
      <span>
        {title}
      </span>

      {size === 'middle' ? (
        <Button icon={<DeleteOutlined />} size="small" onClick={onDelete} />
      ) : null}
      {size === 'small' ? (
        <Button
          css={ButtonSmallCSS}
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          onClick={onDelete}
        />
      ) : null}
    </HeadingStyled>
    {children ? (
      <PanelContentStyled size={size}>
        {children}
      </PanelContentStyled>
    ) : null}
  </PanelStyled>
)
