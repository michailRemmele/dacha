import {
  useMemo,
  useCallback,
  useState,
  FC,
  useEffect,
} from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'

import { DraggableEntityPanel } from './draggable-entity-panel'
import { DragOverlayEntity } from './drag-overlay-entity'
import type { Panel, PanelsProps } from './panels'

interface DraggablePanelsProps extends PanelsProps {
  onDragEntity?: (from: number, to: number) => void
}

export const DraggablePanels: FC<DraggablePanelsProps> = ({
  path,
  panels,
  type,
  onDragEntity,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [draggablePanels, setDraggablePanels] = useState<Array<Panel>>(panels)
  useEffect(() => setDraggablePanels(panels), [panels])

  const [activePanel, setActivePanel] = useState<Panel | null>()

  const panelsIds = useMemo(() => draggablePanels.map((panel) => panel.id), [draggablePanels])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActivePanel(draggablePanels.find((panel) => panel.id === event.active.id))
  }, [draggablePanels])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    setActivePanel(null)

    if (!over || active.id === over?.id) {
      return
    }

    const activePanelIndex = draggablePanels.findIndex((panel) => panel.id === active.id)
    const overPanelIndex = draggablePanels.findIndex((panel) => panel.id === over.id)

    setDraggablePanels(arrayMove(draggablePanels, activePanelIndex, overPanelIndex))
    onDragEntity?.(activePanelIndex, overPanelIndex)
  }, [draggablePanels, onDragEntity])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={panelsIds} strategy={verticalListSortingStrategy}>
        {draggablePanels.map((entity) => (
          <DraggableEntityPanel
            key={entity.id}
            path={path}
            entity={entity}
            type={type}
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {activePanel ? <DragOverlayEntity path={path} entity={activePanel} type={type} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
