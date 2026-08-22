import { useMemo, useCallback, useState, FC, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { type SortingLayer } from 'dacha/renderer';

import { DraggableSortingLayer } from './draggable-sorting-layer';
import { DragOverlayView } from './drag-overlay-view';

interface DraggablePanelsProps {
  sortingLayers: SortingLayer[];
  onDragEntity?: (from: number, to: number) => void;
}

export const DraggableSortingLayers: FC<DraggablePanelsProps> = ({
  sortingLayers,
  onDragEntity,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [draggablePanels, setDraggablePanels] =
    useState<SortingLayer[]>(sortingLayers);

  useEffect(() => setDraggablePanels(sortingLayers), [sortingLayers]);

  const [activeSortingLayer, setActiveSortingLayer] =
    useState<SortingLayer | null>();

  const panelsIds = useMemo(
    () => draggablePanels.map((panel) => panel.id),
    [draggablePanels],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveSortingLayer(
        draggablePanels.find((panel) => panel.id === event.active.id),
      );
    },
    [draggablePanels],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveSortingLayer(null);

      if (!over || active.id === over?.id) {
        return;
      }

      const activePanelIndex = draggablePanels.findIndex(
        (panel) => panel.id === active.id,
      );
      const overPanelIndex = draggablePanels.findIndex(
        (panel) => panel.id === over.id,
      );

      setDraggablePanels(
        arrayMove(draggablePanels, activePanelIndex, overPanelIndex),
      );
      onDragEntity?.(activePanelIndex, overPanelIndex);
    },
    [draggablePanels, onDragEntity],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={panelsIds} strategy={verticalListSortingStrategy}>
        {draggablePanels.map((panel) => (
          <DraggableSortingLayer key={panel.id} id={panel.id} />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeSortingLayer ? (
          <DragOverlayView id={activeSortingLayer.id} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
