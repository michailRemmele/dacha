import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { LevelConfig, ActorConfig } from 'dacha'

import { addValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

const updateIds = (actor: ActorConfig): void => {
  actor.id = uuidv4()
  actor.children?.forEach(updateIds)
}

const getDuplicate = (level: LevelConfig): LevelConfig => {
  const duplicate = structuredClone(level)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  duplicate.id = uuidv4()
  duplicate.actors.forEach(updateIds)

  return duplicate
}

export const duplicateLevel = (
  sourcePath: string[],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const level = getState(sourcePath) as LevelConfig

  dispatch(addValue(destinationPath, getDuplicate(level)))
}
