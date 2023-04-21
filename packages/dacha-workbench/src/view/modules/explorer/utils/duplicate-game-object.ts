import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { GameObjectConfig } from 'remiz'

export const updateIds = (gameObject: GameObjectConfig): void => {
  gameObject.id = uuidv4()
  gameObject.children?.forEach(updateIds)
}

export const duplicateGameObject = (gameObject: GameObjectConfig): GameObjectConfig => {
  const duplicate = structuredClone(gameObject)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  updateIds(duplicate)

  return duplicate
}
