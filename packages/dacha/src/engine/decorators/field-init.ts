type FieldSource = Record<string, unknown>;

const sources = new WeakMap<object, FieldSource>();

const cloneValue = (value: unknown): unknown =>
  typeof value === 'object' && value !== null ? structuredClone(value) : value;

export const setFieldSource = (instance: object, source: unknown): void => {
  if (typeof source === 'object' && source !== null) {
    sources.set(instance, source as FieldSource);
  }
};

export const resolveFieldValue = (
  instance: object,
  key: string,
  init: unknown,
  initialValue: unknown,
): unknown => {
  const value = sources.get(instance)?.[key];
  if (value !== undefined && value !== null) {
    return cloneValue(value);
  }
  if (init !== undefined) {
    return init;
  }
  return cloneValue(initialValue);
};
