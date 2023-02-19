import type { SchemasDataEntry } from '../../../../providers'

export interface Entity {
  id: string
  label: string
  data: SchemasDataEntry
}

export type EntityType = 'components' | 'systems'
