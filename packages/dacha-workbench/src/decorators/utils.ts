import type { Field, FieldType } from '../types/widget-schema'

import type { Constructor } from './types'

export const defineMetaProperty = (
  constructor: Constructor<unknown>,
  key: string,
  value: unknown,
): void => {
  Object.defineProperty(constructor, key, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  })
}

export const getFieldTypeName = (type: unknown): FieldType => {
  switch (type) {
    case String: return 'string'
    case Number: return 'number'
    case Boolean: return 'boolean'
    default: return 'string'
  }
}

export const mergeFields = (fields1?: Field[], fields2?: Field[]): Field[] => {
  const fieldMap = new Map<string, Field>()

  fields1?.forEach((field) => {
    fieldMap.set(field.name, field)
  })
  fields2?.forEach((field) => {
    fieldMap.set(field.name, field)
  })

  return Array.from(fieldMap.values())
}

export const getFieldInitialValue = (type: FieldType): unknown => {
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

export const getInitialStateFromFields = (
  fields: Field[],
): Record<string, unknown> => fields.reduce((acc, field) => {
  acc[field.name] = field.initialValue ?? getFieldInitialValue(field.type)
  return acc
}, {} as Record<string, unknown>)

export const buildInitialState = (
  fields: Field[],
  getInitialState?: () => Record<string, unknown>,
): Record<string, unknown> => ({
  ...(getInitialState?.() ?? {}),
  ...getInitialStateFromFields(fields),
})

export const isEditor = (): boolean => Boolean(window.DachaWorkbench)
