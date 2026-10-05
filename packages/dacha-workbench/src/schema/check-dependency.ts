import type { FieldDependencyValue } from 'dacha';

export const checkDependency = (
  value: unknown,
  checker: FieldDependencyValue,
): boolean => {
  if (typeof value === 'string' && typeof checker === 'string') {
    return new RegExp(checker).test(value);
  }
  return value === checker;
};
