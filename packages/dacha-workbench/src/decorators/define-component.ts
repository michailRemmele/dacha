import type { WidgetSchema, Field } from '../types/widget-schema'
import { type ComponentConstructor } from '../types/engine'
import { widgetRegistry } from '../hocs/widget-registry'

import { schemaRegistry } from './schema-registry'

import {
  defineMetaProperty,
  mergeFields,
  buildInitialState,
  isEditor,
} from './utils'

interface DefineComponentOptions extends Omit<WidgetSchema, 'view'> {
  name: string
}

export function DefineComponent({
  name,
  ...widget
}: DefineComponentOptions): (constructor: ComponentConstructor) => void {
  return (constructor: ComponentConstructor): void => {
    defineMetaProperty(constructor, 'componentName', name)

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

    schemaRegistry.addWidget('component', name, {
      ...widget,
      view: widgetRegistry.getWidget(name),
      fields,
      getInitialState,
    })
  }
}
