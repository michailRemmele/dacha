import { useCallback, type FC, type ReactNode } from 'react';

import type { WidgetSchema } from '../../../../../../../types/widget-schema';
import { SortableList } from '../../../sortable-list';

import { ScriptEntryPanel } from './script-entry-panel';

export interface ListEntry {
  id: string;
  name: string;
  options?: Record<string, unknown>;
}

interface SortableEntriesProps {
  entries: ListEntry[];
  path: string[];
  schemas: Record<string, WidgetSchema>;
  context?: Record<string, unknown>;
  onDelete: (id: string) => void;
  onMove: (from: number, to: number) => void;
}

const getKey = (entry: ListEntry): string => entry.id;

export const SortableEntries: FC<SortableEntriesProps> = ({
  entries,
  path,
  schemas,
  context,
  onDelete,
  onMove,
}) => {
  const renderEntry = useCallback(
    (entry: ListEntry, _index: number, handle: ReactNode) => (
      <ScriptEntryPanel
        entry={entry}
        path={path}
        schema={schemas[entry.name]}
        context={context}
        extra={handle}
        onDelete={onDelete}
      />
    ),
    [path, schemas, context, onDelete],
  );

  return (
    <SortableList
      items={entries}
      getKey={getKey}
      renderItem={renderEntry}
      onMove={onMove}
      resetKey={path.join('.')}
      handleTestId="script-entry-handle"
    />
  );
};
