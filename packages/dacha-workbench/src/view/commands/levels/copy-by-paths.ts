import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { LevelConfig, ActorConfig } from 'dacha'

import type { DispatchFn } from '../../hooks/use-commander'
import { copyByPaths as copyByPathsBase } from '..'
import { LEVEL_PATH_LEGTH } from '../../../consts/paths'

const updateIds = (actor: ActorConfig): void => {
  actor.id = uuidv4()
  actor.children?.forEach(updateIds)
}

const getActorDuplicate = (actor: unknown): ActorConfig => {
  const duplicate = structuredClone(actor as ActorConfig)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  updateIds(duplicate)

  return duplicate
}

const getLevelDuplicate = (level: unknown): LevelConfig => {
  const duplicate = structuredClone(level as LevelConfig)
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`
  duplicate.id = uuidv4()
  duplicate.actors.forEach(updateIds)

  return duplicate
}

export const copyByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
): void => {
  const isActorDestination = destinationPath.at(-1) !== 'levels'

  const filteredSourcePaths = isActorDestination
    ? sourcePaths.filter((path) => path.length > LEVEL_PATH_LEGTH)
    : sourcePaths.filter((path) => path.length === LEVEL_PATH_LEGTH)

  dispatch(copyByPathsBase(
    filteredSourcePaths,
    destinationPath,
    isActorDestination ? getActorDuplicate : getLevelDuplicate,
  ))
}
