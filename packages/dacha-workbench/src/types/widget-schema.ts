import type { FC } from 'react'

export type DependencyValue = string | number | boolean

export interface Dependency {
  name: string
  value: DependencyValue
}

export interface ReferenceItem {
  title: string
  value: string
}

export interface Reference {
  items: Array<ReferenceItem>
}

export type References = Record<string, Reference | undefined>

export type FieldType = 'string' | 'number' | 'boolean' | 'select' | 'multitext'

export interface Field {
  name: string
  title: string
  type: FieldType
  referenceId?: string
  dependency?: Dependency
}

export interface WidgetProps {
  fields: Array<Field>
  references?: References
  path: Array<string>
}

export interface WidgetPartSchema {
  fields: Array<Field>
  references?: References
}

export interface WidgetSchema {
  title: string
  fields?: Array<Field>
  references?: References
  view?: FC<WidgetProps>
}
