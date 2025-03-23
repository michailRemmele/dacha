import { forwardRef } from 'react'
import { HolderOutlined } from '@ant-design/icons'

import { HolderOutlinedCSS } from './sorting-layers.style'
import { SortingLayer } from './sorting-layer'
import type { SortingLayerProps } from './sorting-layer'

export const DragOverlayView = forwardRef<HTMLDivElement, Pick<SortingLayerProps, 'id'>>((props, ref) => (
  <div ref={ref}>
    <SortingLayer
      {...props}
      expandExtra={<HolderOutlined css={HolderOutlinedCSS} />}
    />
  </div>
))
