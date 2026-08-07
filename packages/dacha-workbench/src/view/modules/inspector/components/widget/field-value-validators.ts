import type { FieldType } from '../../../../../types/widget-schema'

const isFiniteNumber = (value: unknown): boolean => typeof value === 'number' && Number.isFinite(value)

export const fieldValueValidators: Partial<Record<FieldType, (value: unknown) => boolean>> = {
  number: isFiniteNumber,
  range: isFiniteNumber,
}
