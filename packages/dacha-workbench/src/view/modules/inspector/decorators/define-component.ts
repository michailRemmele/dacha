import type { Component } from 'dacha'

import { schemaRegistry } from '../schema-registry'
import type { WidgetSchema, Field } from '../../../../types/widget-schema'

import { defineMetaProperty, mergeFields, buildInitialState } from './utils'
import type { Constructor } from './types'

type ComponentConstructor<T extends Component = Component>
  = Constructor<T> & { componentName: string };

interface DefineComponentOptions extends WidgetSchema {
  name: string
}

export function DefineComponent({
  name,
  ...widget
}: DefineComponentOptions): (constructor: ComponentConstructor) => void {
  return (constructor: ComponentConstructor): void => {
    defineMetaProperty(constructor, 'componentName', name)

    const fields = mergeFields(
      widget.fields,
      Reflect.getMetadata('schema:fields', constructor) as Field[] | undefined,
    )
    const getInitialState = (): Record<string, unknown> => buildInitialState(
      fields,
      widget.getInitialState,
    )

    schemaRegistry.addWidget('component', name, {
      ...widget,
      fields,
      getInitialState,
    })
  }
}
