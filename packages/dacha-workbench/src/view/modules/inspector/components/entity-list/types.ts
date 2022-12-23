import type { SchemasDataEntry } from '../../../../providers'

export interface Entity {
  id: string
  label: string
  data: SchemasDataEntry
}

export interface EntityOption {
  label: string
  value: string
}

export type EntityType = 'components' | 'systems'
