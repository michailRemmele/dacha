import type { Field, FieldType } from '../types/widget-schema'
import { type Constructor } from '../types/engine'

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

export const isEditor = (): boolean => Boolean(window.DachaWorkbench)
