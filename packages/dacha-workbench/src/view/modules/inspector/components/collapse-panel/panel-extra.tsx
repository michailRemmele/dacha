import { FC } from 'react'
import { TrashBin } from '@gravity-ui/icons'
import { Icon, IconButton } from '../../../../components'

export interface PanelExtraProps {
  onDelete: (event: React.MouseEvent<HTMLElement>) => void
}

export const PanelExtra: FC<PanelExtraProps> = ({
  onDelete,
}) => (
  <IconButton icon={<Icon icon={<TrashBin />} />} onClick={onDelete} />
)
