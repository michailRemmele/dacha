export type EntityType = 'state' | 'transition' | 'frame' | 'substate'

export interface InspectedEntity {
  type: EntityType
  path: Array<string>
}
