export interface Dependency {
  name: string
  value: string
}

export interface ReferenceItem {
  title: string
  value: string
}

export interface Reference {
  items: Array<ReferenceItem>
}

export type FieldType = 'string' | 'number' | 'boolean' | 'select'

export interface Field {
  name: string
  title: string
  type: FieldType
  referenceId?: string
  dependency?: Dependency
}

export interface WidgetSchema {
  title: string
  fields: Array<Field>
  references?: Record<string, Reference | undefined>
}
