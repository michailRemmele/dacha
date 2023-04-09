import React, {
  useMemo,
  useCallback,
  FC,
} from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { DraggableEntityPanel } from './draggable-entity-panel'
import type { PanelsProps } from './panels'

interface DraggablePanelsProps extends PanelsProps {
  onDragEntity?: (from: number, to: number) => void
}

export const DraggablePanels: FC<DraggablePanelsProps> = ({ panels, type, onDragEntity }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const panelsIds = useMemo(() => panels.map((panel) => panel.id), [panels])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over?.id) {
      return
    }

    const activePanelIndex = panels.findIndex((panel) => panel.id === active.id)
    const overPanelIndex = panels.findIndex((panel) => panel.id === over.id)

    onDragEntity?.(activePanelIndex, overPanelIndex)
  }, [panels, onDragEntity])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={panelsIds} strategy={verticalListSortingStrategy}>
        {panels.map((entity) => (
          <DraggableEntityPanel
            key={entity.id}
            entity={entity}
            type={type}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
