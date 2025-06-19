import type { SchemasDataEntry } from '../../../../providers'

export interface Entity {
  id: string
  label: string
  data: SchemasDataEntry | (Partial<SchemasDataEntry> & Pick<SchemasDataEntry, 'name'>)
}

export type EntityType = 'components' | 'systems'
