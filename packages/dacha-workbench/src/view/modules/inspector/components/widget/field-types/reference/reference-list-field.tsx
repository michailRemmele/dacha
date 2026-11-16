import { useCallback, useContext, useMemo, FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashBin } from '@gravity-ui/icons';
import type { ReferenceType } from 'dacha';

import { Icon } from '../../../../../../components/icon';
import { IconButton } from '../../../../../../components/icon-button';
import { SortableList } from '../../../sortable-list';
import { WidgetFieldContext } from '../../widget-field-context';
import { NAMESPACE_EDITOR } from '../../../../../../providers/schemas-provider/consts';
import { Select } from '../../../select';

import { ReferenceSelect } from './reference-select';
import type { ReferenceOptions } from './use-reference-options';
import * as styles from './reference.module.css';

const getRowKeys = (ids: string[]): string[] => {
  const seen = new Map<string, number>();
  return ids.map((id) => {
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    return `${id}#${count}`;
  });
};

export interface ReferenceListFieldProps extends ReferenceOptions {
  type: ReferenceType;
  value: string[];
  label: string;
  unique?: boolean;
  sortable?: boolean;
  onChange: (value: string[]) => void;
  onAccept?: () => void;
}

export const ReferenceListField: FC<ReferenceListFieldProps> = ({
  type,
  options,
  available,
  value,
  label,
  unique,
  sortable,
  onChange,
  onAccept,
}) => {
  const { t } = useTranslation(NAMESPACE_EDITOR);
  const { fieldPath } = useContext(WidgetFieldContext);

  const rowKeys = useMemo(() => getRowKeys(value), [value]);

  const commit = useCallback(
    (next: string[]) => {
      onChange(next);
      onAccept?.();
    },
    [onChange, onAccept],
  );

  const addOptions = useMemo(() => {
    const taken = new Set(unique ? value : []);
    return options.filter((option) => !taken.has(String(option.value)));
  }, [options, value, unique]);

  const handleAdd = useCallback(
    (id: string | null) => {
      if (!id) {
        return;
      }
      commit([...value, id]);
    },
    [commit, value],
  );

  const handleMove = useCallback(
    (from: number, to: number) => {
      const next = [...value];
      next.splice(to, 0, ...next.splice(from, 1));
      commit(next);
    },
    [commit, value],
  );

  const renderRow = useCallback(
    (id: string, index: number, handle: ReactNode) => (
      <div className={styles.row}>
        {handle}
        <ReferenceSelect
          className={styles.rowSelect}
          value={id}
          options={
            unique
              ? options.filter(
                  (option) =>
                    option.value === id ||
                    !value.includes(String(option.value)),
                )
              : options
          }
          available={available}
          onChange={(next): void => {
            const updated = [...value];
            updated[index] = next ?? '';
            commit(updated);
          }}
        />
        <IconButton
          className={styles.rowDelete}
          icon={<Icon icon={<TrashBin />} />}
          onClick={(): void =>
            commit(value.filter((_, entryIndex) => entryIndex !== index))
          }
          data-testid="reference-entry-delete"
        />
      </div>
    ),
    [options, available, value, unique, commit],
  );

  const getKey = useCallback(
    (_id: string, index: number) => rowKeys[index],
    [rowKeys],
  );

  return (
    <div className={styles.listField}>
      <span className={styles.label}>{label}</span>
      <div className={value.length ? styles.sortableList : undefined}>
        <SortableList
          items={value}
          getKey={getKey}
          renderItem={renderRow}
          onMove={handleMove}
          sortable={sortable}
          resetKey={fieldPath.join('.')}
          handleTestId="reference-entry-handle"
        />
      </div>
      <Select
        className={styles.select}
        size="small"
        value={null}
        options={addOptions}
        onChange={handleAdd}
        searchable
        disabled={!available}
        placeholder={
          available
            ? t('inspector.reference.add', { name: type })
            : t('inspector.reference.noValues')
        }
      />
    </div>
  );
};
