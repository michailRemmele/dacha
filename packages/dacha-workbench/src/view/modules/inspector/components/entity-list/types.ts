export interface Entity {
  name: string
}

export interface ComponentProps<T extends Entity> {
  entity: T
}

export interface EntityOption {
  label: string
  value: string
}
