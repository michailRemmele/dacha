export interface Entity {
  name: string
}

export interface ComponentProps<T extends Entity> {
  entity: T
}
