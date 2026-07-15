import type { Field, FieldType } from '../types/widget-schema'

import { checkDependency } from './check-dependency'

const getFieldTypeDefault = (type: FieldType): unknown => {
  switch (type) {
    case 'string': return ''
    case 'number': return 0
    case 'boolean': return false
    case 'select': return ''
    case 'multiselect': return []
    case 'multitext': return []
    case 'color': return '#ffffff'
    case 'file': return ''
    case 'range': return 0
    default: return ''
  }
}

export const resolveFieldInitialValue = (field: Field): unknown => {
  if (field.type === 'data') {
    return structuredClone(field.initialValue)
  }
  if (field.initialValue !== undefined) {
    return structuredClone(field.initialValue)
  }
  return getFieldTypeDefault(field.type)
}

const getByDotPath = (state: Record<string, unknown>, dotPath: string): unknown => dotPath
  .split('.')
  .reduce<unknown>(
    (acc, key) => (typeof acc === 'object' && acc !== null
      ? (acc as Record<string, unknown>)[key]
      : undefined),
    state,
  )

export const fillMissingFields = (
  state: Record<string, unknown>,
  fields: Field[],
): Record<string, unknown> => {
  let result = state

  const fill = (field: Field): void => {
    if (getByDotPath(result, field.name) !== undefined) {
      return
    }
    if (field.type !== 'data' && field.dependency !== undefined) {
      const dependencyValue = getByDotPath(result, field.dependency.name)
      if (!checkDependency(dependencyValue, field.dependency.value)) {
        return
      }
    }
    if (result === state) {
      result = { ...state }
    }
    result[field.name] = resolveFieldInitialValue(field)
  }

  // plain fields first so dependency conditions can resolve against them,
  // then dependency fields in declaration order to support chains
  fields.filter((field) => field.type === 'data' || field.dependency === undefined).forEach(fill)
  fields.filter((field) => field.type !== 'data' && field.dependency !== undefined).forEach(fill)

  return result
}

export const buildInitialState = (
  fields: Field[],
): Record<string, unknown> => fillMissingFields({}, fields)
