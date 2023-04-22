import type {
  GameObjectConfig,
  LevelConfig,
  TemplateConfig,
} from 'remiz'

import type { EntityType } from '../../../providers/selected-entity-provider/get-entity-type'

export const getKeysToDelete = (
  entity?: GameObjectConfig | LevelConfig | TemplateConfig,
  type?: EntityType,
  keys: Set<string> = new Set(),
): Set<string> => {
  if (entity === undefined) {
    return keys
  }

  keys.add(entity.id)

  if (type === 'level') {
    (entity as LevelConfig).gameObjects.forEach((gameObject) => {
      getKeysToDelete(gameObject, 'gameObject', keys)
    })
  }

  if (type === 'gameObject') {
    (entity as GameObjectConfig).children?.forEach((child) => {
      getKeysToDelete(child, 'gameObject', keys)
    })
  }

  if (type === 'template') {
    (entity as TemplateConfig).children?.forEach((child) => {
      getKeysToDelete(child, 'template', keys)
    })
  }

  return keys
}
