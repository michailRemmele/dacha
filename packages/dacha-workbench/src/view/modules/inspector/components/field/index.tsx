import { useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';

import type {
  Field as FieldSchema,
  FieldType,
  Dependency,
} from '../../../../../types/widget-schema';
import { formatWidgetName } from '../../../../../utils/format-widget-name';
import { resolveFieldInitialValue } from '../../../../../schema';
import { InputField } from '../input-field';
import { DependencyField } from '../dependency-field';
import { fieldTypes } from '../widget/field-types';
import { fieldValueValidators } from '../widget/field-value-validators';
import { WidgetFieldProvider } from '../widget/widget-field-context';

export interface FieldProps {
  name: string;
  path: string[];
  type?: FieldType | 'data';
  title?: string;
  dependency?: Dependency;
  initialValue?: unknown;
  context?: Record<string, unknown>;
  // comment: Allow any input component, mirroring InputField's contract
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: FC<any>;
  validate?: (value: unknown) => boolean;
  label?: string;
  [key: string]: unknown;
}

export const Field: FC<FieldProps> = ({
  name,
  path,
  type,
  title,
  dependency,
  initialValue,
  context,
  component,
  validate,
  label,
  ...properties
}) => {
  const { t } = useTranslation();

  const dependencyPath = useMemo(() => {
    if (type === 'data' || dependency === undefined) {
      return void 0;
    }
    return path.concat(dependency.name.split('.'));
  }, [path, dependency, type]);
  const fieldPath = useMemo(() => path.concat(name.split('.')), [path, name]);

  if (type === 'data') {
    return null;
  }

  const InputComponent =
    component ?? fieldTypes[type as FieldType] ?? fieldTypes.string;
  const validator = validate ?? (type ? fieldValueValidators[type] : void 0);
  const resolvedLabel = label ?? (title ? t(title) : formatWidgetName(name));

  const inner =
    dependency && dependencyPath ? (
      <DependencyField
        path={fieldPath}
        label={resolvedLabel}
        component={InputComponent}
        dependencyPath={dependencyPath}
        dependencyValue={dependency.value}
        initialValue={resolveFieldInitialValue({
          type,
          initialValue,
        } as unknown as FieldSchema)}
        validate={validator}
        {...properties}
      />
    ) : (
      <InputField
        path={fieldPath}
        label={resolvedLabel}
        component={InputComponent}
        validate={validator}
        {...properties}
      />
    );

  return (
    <WidgetFieldProvider path={path} data={context}>
      {inner}
    </WidgetFieldProvider>
  );
};
