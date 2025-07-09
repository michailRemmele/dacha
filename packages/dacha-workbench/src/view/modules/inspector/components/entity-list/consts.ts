import type { EntityType } from './types'

export const CONFIG_KEY_MAP: Record<EntityType, string> = {
  component: 'config',
  system: 'options',
}

export const PATH_FIELD_MAP: Record<EntityType, string> = {
  component: 'components',
  system: 'systems',
}
