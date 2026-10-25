import { useState, useCallback, useMemo, type FC, type ReactNode } from 'react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip } from '@gravity-ui/icons';

import { Icon } from '../../../../components/icon';
import { NewItemTracker } from '../new-item-tracker';

import * as styles from './sortable-list.module.css';

const ACTIVE_ITEM_OPACITY = 0.5;

const Handle: FC<Record<string, unknown>> = (props) => (
  <Icon className={styles.handle} icon={<Grip />} {...props} />
);

interface SortableItemProps {
  id: string;
  render: (handle: ReactNode) => ReactNode;
  handleTestId: string;
}

const SortableItem: FC<SortableItemProps> = ({ id, render, handleTestId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(active?.id === id && { opacity: ACTIVE_ITEM_OPACITY }),
  };

  return (
    <div ref={setNodeRef} style={style}>
      {render(
        <Handle data-testid={handleTestId} {...attributes} {...listeners} />,
      )}
    </div>
  );
};

export interface SortableListProps<T> {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number, handle: ReactNode) => ReactNode;
  onMove: (from: number, to: number) => void;
  sortable?: boolean;
  resetKey?: string;
  handleTestId?: string;
}

/**
 * A vertical list whose items can be reordered by dragging their grip handle.
 */
export const SortableList = <T,>({
  items,
  getKey,
  renderItem,
  onMove,
  sortable = true,
  resetKey,
  handleTestId = 'sortable-handle',
}: SortableListProps<T>): ReactNode => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const keys = useMemo(
    () => items.map((item, index) => getKey(item, index)),
    [items, getKey],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const index = keys.indexOf(String(event.active.id));
      setActiveIndex(index === -1 ? null : index);
    },
    [keys],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveIndex(null);
      if (!over || active.id === over.id) {
        return;
      }
      onMove(keys.indexOf(String(active.id)), keys.indexOf(String(over.id)));
    },
    [keys, onMove],
  );

  if (!sortable) {
    return (
      <NewItemTracker resetKey={resetKey}>
        {items.map((item, index) => (
          <div key={keys[index]}>{renderItem(item, index, null)}</div>
        ))}
      </NewItemTracker>
    );
  }

  const activeItem = activeIndex === null ? undefined : items[activeIndex];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={keys} strategy={verticalListSortingStrategy}>
        <NewItemTracker resetKey={resetKey}>
          {items.map((item, index) => (
            <SortableItem
              key={keys[index]}
              id={keys[index]}
              handleTestId={handleTestId}
              render={(handle): ReactNode => renderItem(item, index, handle)}
            />
          ))}
        </NewItemTracker>
      </SortableContext>
      <DragOverlay>
        {activeItem !== undefined ? (
          <div className={styles.dragOverlay}>
            {renderItem(activeItem, activeIndex as number, <Handle />)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
