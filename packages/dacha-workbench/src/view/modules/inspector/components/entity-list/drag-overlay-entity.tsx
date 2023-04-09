import React, { forwardRef } from 'react'
import { HolderOutlined } from '@ant-design/icons'

import { EntityPanel } from './entity-panel'
import type { EntityPanelProps } from './entity-panel'

export const DragOverlayEntity = forwardRef<HTMLDivElement, EntityPanelProps>((props, ref) => (
  <div ref={ref}>
    <EntityPanel
      expandExtra={<HolderOutlined className="entity-list__holder" />}
      {...props}
    />
  </div>
))
