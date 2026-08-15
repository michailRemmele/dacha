import { forwardRef } from 'react'
import { Grip } from '@gravity-ui/icons'
import { Icon } from '../../../../components'

import {
  DragOverlayStyled,
  HolderOutlinedCSS,
} from './entity-list.style'
import { EntityPanel } from './entity-panel'
import type { EntityPanelProps } from './entity-panel'

export const DragOverlayEntity = forwardRef<HTMLDivElement, EntityPanelProps>((props, ref) => (
  <DragOverlayStyled ref={ref}>
    <EntityPanel
      expandExtra={<Icon css={HolderOutlinedCSS} icon={<Grip />} />}
      {...props}
    />
  </DragOverlayStyled>
))
