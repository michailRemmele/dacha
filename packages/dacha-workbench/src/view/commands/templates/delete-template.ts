import type {
  TemplateConfig,
  LevelConfig,
  ActorConfig,
} from 'dacha'

import { setValue, deleteValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

const filterActors = (
  actors: Array<ActorConfig>,
  templateId: string,
): Array<ActorConfig> => actors.reduce((acc, actor) => {
  if (actor.templateId === templateId) {
    return acc
  }

  acc.push({
    ...actor,
    children: actor.children && filterActors(actor.children, templateId),
  })

  return acc
}, [] as Array<ActorConfig>)

const filterLevels = (
  levels: Array<LevelConfig>,
  templateId: string,
): Array<LevelConfig> => levels.map((level) => ({
  ...level,
  actors: filterActors(level.actors, templateId),
}))

export const deleteTemplate = (
  path: Array<string>,
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const template = getState(path) as TemplateConfig
  const levels = getState(['levels']) as Array<LevelConfig>

  dispatch(setValue(['levels'], filterLevels(levels, template.id)))
  dispatch(deleteValue(path, true))
}
