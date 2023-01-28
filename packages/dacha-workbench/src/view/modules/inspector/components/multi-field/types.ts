export type MultiFieldEntryType = 'string' | 'number' | 'boolean'

export interface MultiFieldEntry {
  id: string
  name: string
  type: MultiFieldEntryType
  value: string | number | boolean
}
