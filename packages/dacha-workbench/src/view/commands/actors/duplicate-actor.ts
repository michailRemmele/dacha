import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { ActorConfig } from 'dacha'

import { addValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

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
  sourcePath: string[],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const actor = getState(sourcePath) as ActorConfig

  dispatch(addValue(destinationPath, getDuplicate(actor)))
}
