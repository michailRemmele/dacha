import type { WidgetSchema, Field } from '../types/widget-schema'
import { type SystemConstructor } from '../types/engine'
import { widgetRegistry } from '../hocs/widget-registry'

import { schemaRegistry } from './schema-registry'

import {
  defineMetaProperty,
  mergeFields,
  buildInitialState,
  isEditor,
} from './utils'

interface DefineSystemOptions extends Omit<WidgetSchema, 'view'> {
  name: string
}

export function DefineSystem({
  name,
  ...widget
}: DefineSystemOptions): (constructor: SystemConstructor) => void {
  return (constructor: SystemConstructor): void => {
    defineMetaProperty(constructor, 'systemName', name)

    if (!isEditor()) {
      return
    }

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
      view: widgetRegistry.getWidget(name),
      fields,
      getInitialState,
    })
  }
}
