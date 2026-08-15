import type { Field } from '../types/widget-schema'

import { getFieldTypeName, isEditor } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
interface Target { constructor: Function }

type DefineFieldOptions = Partial<Field>

export function DefineField(
  field?: DefineFieldOptions,
): (target: Target, name: string) => void {
  return (target: Target, name: string): void => {
    if (!isEditor()) {
      return
    }

    if (!Reflect.hasOwnMetadata('schema:fields', target.constructor)) {
      Reflect.defineMetadata('schema:fields', [], target.constructor)
    }

    const type = getFieldTypeName(Reflect.getMetadata('design:type', target, name))

    const fields = Reflect.getMetadata('schema:fields', target.constructor) as Field[]

    fields.push({
      ...field,
      name: field?.name ?? name,
      type: field?.type ?? type,
    } as Field)
  }
}
