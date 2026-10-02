import { useState, useCallback, useMemo, type FC } from 'react';
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

import type { WidgetSchema } from '../../../../../../../types/widget-schema';
import { Icon } from '../../../../../../components/icon';

import {
  ScriptEntryPanel,
  type ScriptEntryPanelProps,
} from './script-entry-panel';
import * as styles from './script-field.module.css';

const ACTIVE_ENTRY_OPACITY = 0.5;

export interface ListEntry {
  id: string;
  name: string;
  options?: Record<string, unknown>;
}

const Handle: FC<Record<string, unknown>> = (props) => (
  <Icon
    className={styles.handle}
    icon={<Grip />}
    data-testid="script-entry-handle"
    {...props}
  />
);

const DraggableEntryPanel: FC<ScriptEntryPanelProps> = (props) => {
  const { id } = props.entry;
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(active?.id === id && { opacity: ACTIVE_ENTRY_OPACITY }),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ScriptEntryPanel
        {...props}
        extra={<Handle {...attributes} {...listeners} />}
      />
    </div>
  );
};

interface SortableEntriesProps {
  entries: ListEntry[];
  path: string[];
  schemas: Record<string, WidgetSchema>;
  context?: Record<string, unknown>;
  onDelete: (id: string) => void;
  onMove: (from: number, to: number) => void;
}

export const SortableEntries: FC<SortableEntriesProps> = ({
  entries,
  path,
  schemas,
  context,
  onDelete,
  onMove,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activeEntry, setActiveEntry] = useState<ListEntry | null>(null);

  const ids = useMemo(() => entries.map((entry) => entry.id), [entries]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveEntry(
        entries.find((entry) => entry.id === event.active.id) ?? null,
      );
    },
    [entries],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveEntry(null);
      if (!over || active.id === over.id) {
        return;
      }
      onMove(
        entries.findIndex((entry) => entry.id === active.id),
        entries.findIndex((entry) => entry.id === over.id),
      );
    },
    [entries, onMove],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {entries.map((entry) => (
          <DraggableEntryPanel
            key={entry.id}
            entry={entry}
            path={path}
            schema={schemas[entry.name]}
            context={context}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeEntry ? (
          <div className={styles.dragOverlay}>
            <ScriptEntryPanel
              entry={activeEntry}
              path={path}
              schema={schemas[activeEntry.name]}
              context={context}
              extra={<Handle />}
              onDelete={onDelete}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
