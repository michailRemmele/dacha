import type { Field, FieldType, Schema } from './types';

(Symbol as { metadata?: symbol }).metadata ??= Symbol.for('Symbol.metadata');

const SCHEMA_KEY = Symbol.for('dacha.schema');
const FIELDS_KEY = Symbol.for('dacha.fields');

type MetadataRecord = Record<PropertyKey, unknown>;

let fieldCounter = 0;
const fieldOrder = new WeakMap<Field, number>();

export const nextFieldOrder = (): number => {
  fieldCounter += 1;
  return fieldCounter;
};

const orderOf = (field: Field): number =>
  fieldOrder.get(field) ?? Number.NEGATIVE_INFINITY;

export const addField = (
  metadata: DecoratorMetadataObject,
  field: Field,
  order: number,
): void => {
  const record = metadata as MetadataRecord;
  if (!Object.hasOwn(record, FIELDS_KEY)) {
    record[FIELDS_KEY] = [
      ...((record[FIELDS_KEY] as Field[] | undefined) ?? []),
    ];
  }
  fieldOrder.set(field, order);

  const fields = record[FIELDS_KEY] as Field[];
  let index = fields.length;
  while (index > 0 && orderOf(fields[index - 1]) > order) {
    index -= 1;
  }
  fields.splice(index, 0, field);
};

export const getDecoratedFields = (
  metadata: DecoratorMetadataObject,
): Field[] =>
  ((metadata as MetadataRecord)[FIELDS_KEY] as Field[] | undefined) ?? [];

/**
 * Makes `fields` the list a subclass starts from, including fields that came from
 * the decorator's `fields` option rather than from `@DefineField`.
 */
export const setInheritedFields = (
  metadata: DecoratorMetadataObject,
  fields: Field[],
): void => {
  (metadata as MetadataRecord)[FIELDS_KEY] = fields;
};

export const setSchema = (
  metadata: DecoratorMetadataObject,
  schema: Schema,
): void => {
  (metadata as MetadataRecord)[SCHEMA_KEY] = schema;
};

/**
 * Returns the schema a `Define*` decorator stored on a class.
 *
 * Only a class decorated itself has one. A subclass of a decorated class does not.
 *
 * @param target - Any value. Values that are not decorated classes return `undefined`.
 * @returns The class's own schema, or `undefined`.
 *
 * @category Editor Schema
 * @advanced
 */
export const getSchema = (target: unknown): Schema | undefined => {
  if (typeof target !== 'function' || !Object.hasOwn(target, Symbol.metadata)) {
    return undefined;
  }
  const metadata = (target as unknown as Record<symbol, unknown>)[
    Symbol.metadata
  ];
  if (
    !metadata ||
    typeof metadata !== 'object' ||
    !Object.hasOwn(metadata, SCHEMA_KEY)
  ) {
    return undefined;
  }
  return (metadata as MetadataRecord)[SCHEMA_KEY] as Schema;
};

const isPoint = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { x?: unknown }).x === 'number' &&
  typeof (value as { y?: unknown }).y === 'number';

export const inferFieldType = (
  type: FieldType | 'data' | undefined,
  initialValue: unknown,
): FieldType | 'data' => {
  if (type) {
    return type;
  }
  switch (typeof initialValue) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return 'string';
    default:
      return isPoint(initialValue) ? 'vector' : 'string';
  }
};

export const mergeFields = (
  optionFields: Field[] = [],
  decorated: Field[] = [],
): Field[] => {
  const result = [...optionFields];
  decorated.forEach((field) => {
    const index = result.findIndex((entry) => entry.name === field.name);
    if (index === -1) {
      result.push(field);
    } else {
      result[index] = field;
    }
  });
  return result;
};

export const defineStaticName = (
  target: object,
  key: string,
  value: string,
): void => {
  Object.defineProperty(target, key, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  });
};
