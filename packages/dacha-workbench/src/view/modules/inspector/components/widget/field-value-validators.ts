import type { FieldType } from '../../../../../types/widget-schema';
import type { Point } from 'dacha';

const isFiniteNumber = (value: unknown): boolean =>
  typeof value === 'number' && Number.isFinite(value);

const isVectorValue = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  isFiniteNumber((value as Point).x) &&
  isFiniteNumber((value as Point).y);

export const fieldValueValidators: Partial<
  Record<FieldType, (value: unknown) => boolean>
> = {
  number: isFiniteNumber,
  range: isFiniteNumber,
  vector: isVectorValue,
};
