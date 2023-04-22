import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { SceneConfig } from 'remiz'

export const duplicateScene = (scene: SceneConfig): SceneConfig => {
  const duplicate = structuredClone(scene)
  duplicate.id = uuidv4()
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`

  return duplicate
}
