import { useCallback, useContext, FC } from 'react';
import type { ReferenceType } from 'dacha';

import { WidgetFieldContext } from '../../widget-field-context';

import { ReferenceSelect } from './reference-select';
import { ReferenceListField } from './reference-list-field';
import {
  useAssetOptions,
  useTemplateOptions,
  useSceneOptions,
  useActorOptions,
} from './use-reference-options';
import type { ReferenceOptions } from './use-reference-options';

export interface ReferenceFieldProps {
  value?: string | string[];
  onChange: (value: unknown) => void;
  onAccept?: () => void;
  label: string;
  kind?: string;
  multiple?: boolean;
  unique?: boolean;
  sortable?: boolean;
}

const toList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value as string[];
  }
  return typeof value === 'string' && value ? [value] : [];
};

const toSingle = (value: unknown): string | null => {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : null;
  }
  return typeof value === 'string' ? value : null;
};

interface TypedReferenceFieldProps
  extends ReferenceFieldProps, ReferenceOptions {
  type: ReferenceType;
}

/** Draws a reference field from the options its typed wrapper below finds. */
export const ReferenceField: FC<TypedReferenceFieldProps> = ({
  type,
  options,
  available,
  value,
  onChange,
  onAccept,
  label,
  multiple,
  unique,
  sortable,
}) => {
  const handleChange = useCallback(
    (next: string | null) => onChange(next ?? ''),
    [onChange],
  );

  if (multiple) {
    return (
      <ReferenceListField
        type={type}
        options={options}
        available={available}
        value={toList(value)}
        label={label}
        unique={unique}
        sortable={sortable}
        onChange={onChange}
        onAccept={onAccept}
      />
    );
  }

  return (
    <ReferenceSelect
      value={toSingle(value)}
      options={options}
      available={available}
      onChange={handleChange}
      onAccept={onAccept}
      label={label}
    />
  );
};

export const AssetField: FC<ReferenceFieldProps> = (props) => {
  const options = useAssetOptions(props.kind);
  return <ReferenceField type="asset" {...options} {...props} />;
};

export const TemplateField: FC<ReferenceFieldProps> = (props) => {
  const options = useTemplateOptions();
  return <ReferenceField type="template" {...options} {...props} />;
};

export const SceneField: FC<ReferenceFieldProps> = (props) => {
  const options = useSceneOptions();
  return <ReferenceField type="scene" {...options} {...props} />;
};

export const ActorField: FC<ReferenceFieldProps> = (props) => {
  const { fieldPath } = useContext(WidgetFieldContext);
  const options = useActorOptions(fieldPath);
  return <ReferenceField type="actor" {...options} {...props} />;
};

export { ReferenceSelect } from './reference-select';
