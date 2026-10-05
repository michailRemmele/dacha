import { useCallback, useContext, type FC } from 'react';
import type { ScriptFieldKind } from 'dacha';

import { WidgetFieldContext } from '../../widget-field-context';

import { SingleScriptField, type SingleEntry } from './single-script-field';
import { ScriptListField } from './script-list-field';
import type { ListEntry } from './sortable-entries';

export interface ScriptFieldProps {
  value?: SingleEntry | ListEntry[];
  onChange: (value: unknown) => void;
  onAccept: () => void;
  label: string;
  kind: ScriptFieldKind;
  multiple?: boolean;
  unique?: boolean;
  sortable?: boolean;
}

export const ScriptField: FC<ScriptFieldProps> = ({
  value,
  onChange,
  onAccept,
  label,
  kind,
  multiple,
  unique,
  sortable,
}) => {
  const { fieldPath, data } = useContext(WidgetFieldContext);

  const commit = useCallback(
    (next: unknown) => {
      onChange(next);
      onAccept();
    },
    [onChange, onAccept],
  );

  return multiple ? (
    <ScriptListField
      entries={(value as ListEntry[] | undefined) ?? []}
      onCommit={commit}
      path={fieldPath}
      kind={kind}
      label={label}
      unique={unique}
      sortable={sortable}
      context={data}
    />
  ) : (
    <SingleScriptField
      value={value as SingleEntry | undefined}
      onCommit={commit}
      path={fieldPath}
      kind={kind}
      label={label}
      context={data}
    />
  );
};
