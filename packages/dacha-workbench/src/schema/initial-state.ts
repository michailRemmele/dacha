import type { Field, FieldType } from 'dacha';

import { checkDependency } from './check-dependency';

const REFERENCE_TYPES = new Set<FieldType>([
  'asset',
  'template',
  'scene',
  'actor',
]);

const getFieldTypeDefault = (type: FieldType): unknown => {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'select':
      return '';
    case 'multiselect':
      return [];
    case 'multitext':
      return [];
    case 'color':
      return '#ffffff';
    case 'file':
      return '';
    case 'range':
      return 0;
    case 'asset':
    case 'template':
    case 'scene':
    case 'actor':
      return '';
    case 'vector':
      return { x: 0, y: 0 };
    default:
      return '';
  }
};

export const resolveFieldInitialValue = (field: Field): unknown => {
  if (field.type === 'script') {
    return field.multiple ? [] : undefined;
  }
  if (field.type === 'data') {
    return structuredClone(field.initialValue);
  }
  if (field.initialValue !== undefined) {
    return structuredClone(field.initialValue);
  }
  if (REFERENCE_TYPES.has(field.type) && 'multiple' in field && field.multiple) {
    return [];
  }
  return getFieldTypeDefault(field.type);
};

export const fillMissingFields = (
  state: Record<string, unknown>,
  fields: Field[],
): Record<string, unknown> => {
  let result = state;

  const fill = (field: Field): void => {
    if (field.type === 'script' && !field.multiple) {
      return;
    }
    if (result[field.name] !== undefined) {
      return;
    }
    if (field.type !== 'data' && field.dependency !== undefined) {
      const dependencyValue = result[field.dependency.name];
      if (!checkDependency(dependencyValue, field.dependency.value)) {
        return;
      }
    }
    if (result === state) {
      result = { ...state };
    }
    result[field.name] = resolveFieldInitialValue(field);
  };

  // plain fields first so dependency conditions can resolve against them
  fields
    .filter((field) => field.type === 'data' || field.dependency === undefined)
    .forEach(fill);
  fields
    .filter((field) => field.type !== 'data' && field.dependency !== undefined)
    .forEach(fill);

  return result;
};

export const buildInitialState = (fields: Field[]): Record<string, unknown> =>
  fillMissingFields({}, fields);
