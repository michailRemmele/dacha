import React, { FC } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

export interface PanelExtraProps {
  onDelete: (event: React.MouseEvent<HTMLElement>) => void
}

export const PanelExtra: FC<PanelExtraProps> = ({
  onDelete,
}) => (
  <Button icon={<DeleteOutlined />} size="small" onClick={onDelete} />
)
