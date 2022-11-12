export interface Entity {
  name: string
  id: string
}

export interface ComponentProps<T extends Entity> {
  entity: T
}

export interface EntityOption {
  label: string
  value: string
}
