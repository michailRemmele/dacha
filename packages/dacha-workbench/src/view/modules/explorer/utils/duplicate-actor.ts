import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { ActorConfig } from 'remiz'

export const updateIds = (actor: ActorConfig): void => {
  actor.id = uuidv4()
  actor.children?.forEach(updateIds)
}

export const duplicateActor = (actor: ActorConfig): ActorConfig => {
  const duplicate = structuredClone(actor)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  updateIds(duplicate)

  return duplicate
}
