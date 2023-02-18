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

export type FieldType = 'string' | 'number' | 'boolean' | 'select' | 'multitext' | 'multiselect'

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

export interface WidgetSchema {
  title: string
  fields?: Array<Field>
  references?: References
  view?: FC<WidgetProps>
  getInitial?: () => Record<string, unknown>
}

export interface WidgetPartSchema extends Omit<WidgetSchema, 'title' | 'fields' | 'view'> {
  fields: Array<Field>
}
