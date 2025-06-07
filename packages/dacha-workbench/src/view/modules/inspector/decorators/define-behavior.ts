import { schemaRegistry } from '../schema-registry'
import type { WidgetSchema, Field } from '../../../../types/widget-schema'

import { defineMetaProperty, mergeFields, buildInitialState } from './utils'
import type { Constructor } from './types'

type BehaviorConstructor<T = unknown>
  = Constructor<T> & { behaviorName: string };

interface DefineBehaviorOptions extends WidgetSchema {
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
      fields,
      getInitialState,
    })
  }
}
