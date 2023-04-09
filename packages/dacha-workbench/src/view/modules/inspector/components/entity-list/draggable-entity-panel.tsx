import React, { FC } from 'react'
import { HolderOutlined } from '@ant-design/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { EntityPanel } from './entity-panel'
import type { EntityPanelProps } from './entity-panel'

const ACTIVE_ENTITY_OPACITY = 0.5

type WithDraggableFn = (Component: FC<EntityPanelProps>) => FC<EntityPanelProps>

const withDraggable: WithDraggableFn = (Component) => {
  const WrappedComponent: FC<EntityPanelProps> = (props) => {
    const { entity } = props

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      active,
    } = useSortable({ id: entity.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      ...(active?.id === entity.id && { opacity: ACTIVE_ENTITY_OPACITY }),
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
      >
        <Component
          expandExtra={(
            <HolderOutlined className="entity-list__holder" {...attributes} {...listeners} />
          )}
          {...props}
        />
      </div>
    )
  }

  return WrappedComponent
}

export const DraggableEntityPanel = withDraggable(EntityPanel)
