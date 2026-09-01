import { forwardRef } from 'react'
import { Grip } from '@gravity-ui/icons'
import { Icon } from '../../../../components'

import * as styles from './entity-list.module.css'
import { EntityPanel } from './entity-panel'
import type { EntityPanelProps } from './entity-panel'

export const DragOverlayEntity = forwardRef<HTMLDivElement, EntityPanelProps>((props, ref) => (
  <div ref={ref} className={styles.dragOverlay}>
    <EntityPanel
      expandExtra={<Icon className={styles.holder} icon={<Grip />} />}
      {...props}
    />
  </div>
))
