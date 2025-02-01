import type {
  LevelConfig,
  ActorConfig,
} from 'dacha'

import { setValue, deleteByPaths } from '..'
import { getIdByPath } from '../../../utils/get-id-by-path'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

const filterActors = (
  actors: Array<ActorConfig>,
  templateIds: Set<string>,
): Array<ActorConfig> => actors.reduce((acc, actor) => {
  if (actor.templateId && templateIds.has(actor.templateId)) {
    return acc
  }

  acc.push({
    ...actor,
    children: actor.children && filterActors(actor.children, templateIds),
  })

  return acc
}, [] as Array<ActorConfig>)

const filterLevels = (
  levels: Array<LevelConfig>,
  templateIds: Set<string>,
): Array<LevelConfig> => levels.map((level) => ({
  ...level,
  actors: filterActors(level.actors, templateIds),
}))

export const deleteTemplates = (
  paths: string[][],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const templateIds = new Set(paths.map((path) => getIdByPath(path)))
  const levels = getState(['levels']) as Array<LevelConfig>

  dispatch(setValue(['levels'], filterLevels(levels, templateIds)))
  dispatch(deleteByPaths(paths, true))
}
