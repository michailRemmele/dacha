import type { System } from 'dacha'

import { schemaRegistry } from '../schema-registry'
import type { WidgetSchema, Field } from '../../../../types/widget-schema'

import { defineMetaProperty, mergeFields, buildInitialState } from './utils'
import type { Constructor } from './types'

type SystemConstructor<T extends System = System>
  = Constructor<T> & { systemName: string };

interface DefineSystemOptions extends WidgetSchema {
  name: string
}

export function DefineSystem({
  name,
  ...widget
}: DefineSystemOptions): (constructor: SystemConstructor) => void {
  return (constructor: SystemConstructor): void => {
    defineMetaProperty(constructor, 'systemName', name)

    const fields = mergeFields(
      widget.fields,
      Reflect.getMetadata('schema:fields', constructor) as Field[] | undefined,
    )
    const getInitialState = (): Record<string, unknown> => buildInitialState(
      fields,
      widget.getInitialState,
    )

    schemaRegistry.addWidget('system', name, {
      ...widget,
      fields,
      getInitialState,
    })
  }
}
