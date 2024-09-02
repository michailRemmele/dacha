import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { ActorConfig } from 'remiz'

import { addValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

export const updateIds = (actor: ActorConfig): void => {
  actor.id = uuidv4()
  actor.children?.forEach(updateIds)
}

export const getDuplicate = (actor: ActorConfig): ActorConfig => {
  const duplicate = structuredClone(actor)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  updateIds(duplicate)

  return duplicate
}

export const duplicateActor = (
  path: Array<string>,
  actor: ActorConfig,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue(
    path,
    getDuplicate(actor),
  ))
}
