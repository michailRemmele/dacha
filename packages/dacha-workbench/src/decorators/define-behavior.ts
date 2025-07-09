import type { WidgetSchema, Field } from '../types/widget-schema'
import { widgetRegistry } from '../hocs/widget-registry'

import { schemaRegistry } from './schema-registry'

import {
  defineMetaProperty,
  mergeFields,
  buildInitialState,
  isEditor,
} from './utils'
import type { Constructor } from './types'

type BehaviorConstructor<T = unknown>
  = Constructor<T> & { behaviorName: string };

interface DefineBehaviorOptions extends Omit<WidgetSchema, 'view'> {
  name: string
  systemName?: string
}

export function DefineBehavior({
  name,
  systemName,
  ...widget
}: DefineBehaviorOptions): (constructor: BehaviorConstructor) => void {
  return (constructor: BehaviorConstructor): void => {
    defineMetaProperty(constructor, 'behaviorName', name)

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

    schemaRegistry.addWidget(systemName ? `behavior.${systemName}` : 'behavior', name, {
      ...widget,
      view: widgetRegistry.getWidget(name),
      fields,
      getInitialState,
    })
  }
}
