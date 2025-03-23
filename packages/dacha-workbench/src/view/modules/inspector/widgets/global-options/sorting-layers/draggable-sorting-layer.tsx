import type { FC } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { HolderOutlined } from '@ant-design/icons'

import { SortingLayer } from './sorting-layer'
import {
  HolderOutlinedCSS,
} from './sorting-layers.style'

const ACTIVE_ENTITY_OPACITY = 0.5

export interface SortingLayerProps {
  id: string
}

export const DraggableSortingLayer: FC<SortingLayerProps> = ({ id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    active,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(active?.id === id && { opacity: ACTIVE_ENTITY_OPACITY }),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <SortingLayer
        id={id}
        expandExtra={<HolderOutlined css={HolderOutlinedCSS} {...attributes} {...listeners} />}
      />
    </div>
  )
}
