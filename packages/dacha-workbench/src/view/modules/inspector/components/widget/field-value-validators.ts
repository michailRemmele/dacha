import type {
  FieldType,
  VectorValue,
} from '../../../../../types/widget-schema';

const isFiniteNumber = (value: unknown): boolean =>
  typeof value === 'number' && Number.isFinite(value);

const isVectorValue = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  isFiniteNumber((value as VectorValue).x) &&
  isFiniteNumber((value as VectorValue).y);

export const fieldValueValidators: Partial<
  Record<FieldType, (value: unknown) => boolean>
> = {
  number: isFiniteNumber,
  range: isFiniteNumber,
  vector: isVectorValue,
};
