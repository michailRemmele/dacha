import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { LevelConfig } from 'remiz'

import { updateIds } from './duplicate-game-object'

export const duplicateLevel = (level: LevelConfig): LevelConfig => {
  const duplicate = structuredClone(level)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  duplicate.id = uuidv4()
  duplicate.gameObjects.forEach(updateIds)

  return duplicate
}
