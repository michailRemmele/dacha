import { useMemo, useCallback, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { arrayMove } from '@dnd-kit/sortable';
import type { ScriptFieldKind } from 'dacha';

import { useSchemas } from '../../../../../../hooks';
import { buildInitialState } from '../../../../../../../schema/initial-state';
import { uuid } from '../../../../../../../utils/uuid';
import { formatWidgetName } from '../../../../../../../utils/format-widget-name';
import { EntityMultiselect } from '../../../entity-picker';
import { NewItemTracker } from '../../../new-item-tracker';

import { ScriptEntryPanel } from './script-entry-panel';
import { SortableEntries, type ListEntry } from './sortable-entries';
import * as styles from './script-field.module.css';

interface ScriptListFieldProps {
  entries: ListEntry[];
  onCommit: (entries: ListEntry[]) => void;
  path: string[];
  kind: ScriptFieldKind;
  label: string;
  unique?: boolean;
  sortable?: boolean;
  context?: Record<string, unknown>;
}

export const ScriptListField: FC<ScriptListFieldProps> = ({
  entries,
  onCommit,
  path,
  kind,
  label,
  unique,
  sortable,
  context,
}) => {
  const { t } = useTranslation();
  const schemas = useSchemas(kind);

  const available = useMemo(() => {
    const taken = new Set(unique ? entries.map((entry) => entry.name) : []);
    return Object.keys(schemas)
      .filter((name) => !taken.has(name))
      .map((name) => ({ label: name, value: name }));
  }, [schemas, entries, unique]);

  const handleAdd = useCallback(
    (name: string) => {
      onCommit([
        ...entries,
        {
          id: uuid(),
          name,
          options: buildInitialState(schemas[name].fields ?? []),
        },
      ]);
    },
    [onCommit, entries, schemas],
  );

  const handleDelete = useCallback(
    (id: string) => {
      onCommit(entries.filter((entry) => entry.id !== id));
    },
    [onCommit, entries],
  );

  const handleMove = useCallback(
    (from: number, to: number) => {
      onCommit(arrayMove(entries, from, to));
    },
    [onCommit, entries],
  );

  const handleCreate = useCallback(
    (name: string, filepath: string) => {
      window.electron.createBehavior(name, filepath, kind);
    },
    [kind],
  );

  return (
    <div className={styles.list}>
      <span className={styles.label}>{label}</span>

      {sortable ? (
        <SortableEntries
          entries={entries}
          path={path}
          schemas={schemas}
          context={context}
          onDelete={handleDelete}
          onMove={handleMove}
        />
      ) : (
        <NewItemTracker resetKey={path.join('.')}>
          {entries.map((entry) => (
            <ScriptEntryPanel
              key={entry.id}
              entry={entry}
              path={path}
              schema={schemas[entry.name]}
              context={context}
              onDelete={handleDelete}
            />
          ))}
        </NewItemTracker>
      )}

      <EntityMultiselect
        className={styles.picker}
        size="small"
        placeholder={t('scriptField.add', { name: formatWidgetName(kind) })}
        options={available}
        type={kind}
        onAdd={handleAdd}
        onCreate={handleCreate}
      />
    </div>
  );
};
