import { FC } from 'react'
import { Button } from 'antd'
import { TrashBin } from '@gravity-ui/icons'
import { Icon } from '../../../../components'

export interface PanelExtraProps {
  onDelete: (event: React.MouseEvent<HTMLElement>) => void
}

export const PanelExtra: FC<PanelExtraProps> = ({
  onDelete,
}) => (
  <Button icon={<Icon icon={<TrashBin />} />} onClick={onDelete} />
)
