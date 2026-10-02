import { useMemo, useCallback, type FC } from 'react';
import type { ScriptFieldKind } from 'dacha';

import { useSchemas } from '../../../../../../hooks';
import { buildInitialState } from '../../../../../../../schema/initial-state';
import { cx } from '../../../../../../../utils/cx';
import { Labelled } from '../../../labelled';
import { EntitySelect } from '../../../entity-picker';

import { ScriptOptions } from './script-entry-panel';
import * as styles from './script-field.module.css';

export interface SingleEntry {
  name: string;
  options?: Record<string, unknown>;
}

interface SingleScriptFieldProps {
  value?: SingleEntry;
  onCommit: (value: SingleEntry | undefined) => void;
  path: string[];
  kind: ScriptFieldKind;
  label: string;
  context?: Record<string, unknown>;
}

export const SingleScriptField: FC<SingleScriptFieldProps> = ({
  value,
  onCommit,
  path,
  kind,
  label,
  context,
}) => {
  const schemas = useSchemas(kind);

  const options = useMemo(
    () => Object.keys(schemas).map((name) => ({ label: name, value: name })),
    [schemas],
  );
  const schema = value ? schemas[value.name] : undefined;

  const handleAdd = useCallback(
    (name: string | null) => {
      onCommit(
        name === null
          ? undefined
          : { name, options: buildInitialState(schemas[name].fields ?? []) },
      );
    },
    [onCommit, schemas],
  );

  const handleCreate = useCallback(
    (name: string, filepath: string) => {
      window.electron.createBehavior(name, filepath, kind);
    },
    [kind],
  );

  return (
    <div className={cx(value && !schema && styles.noSchema)}>
      <Labelled label={label}>
        <EntitySelect
          options={options}
          type={kind}
          onAdd={handleAdd}
          onCreate={handleCreate}
          value={value?.name ?? null}
        />
      </Labelled>
      {value ? (
        <ScriptOptions
          path={path.concat('options')}
          schema={schema}
          context={context}
        />
      ) : null}
    </div>
  );
};
