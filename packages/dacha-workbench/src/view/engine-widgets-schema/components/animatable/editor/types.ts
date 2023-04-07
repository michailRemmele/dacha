export type EntityType = 'state' | 'transition' | 'frame' | 'substate'

export interface SelectedEntity {
  type: EntityType
  id: string
}
