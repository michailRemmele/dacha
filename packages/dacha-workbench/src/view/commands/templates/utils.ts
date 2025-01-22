import type { TemplateConfig, ActorConfig, LevelConfig } from 'dacha'

import { buildActorConfig } from '../../../utils/build-actor-config'

const getUpdatedActors = (
  actors: Array<ActorConfig>,
  parentId: string,
  template: TemplateConfig,
): Array<ActorConfig> => actors.map((actor) => {
  if (actor.templateId === parentId) {
    return {
      ...actor,
      children: [...(actor.children || []), buildActorConfig(template)],
    }
  }

  if (actor.children) {
    return {
      ...actor,
      children: getUpdatedActors(actor.children, parentId, template),
    }
  }

  return actor
})

export const getUpdatedLevels = (
  levels: Array<LevelConfig>,
  parentId: string,
  template: TemplateConfig,
): Array<LevelConfig> => levels.map((level) => ({
  ...level,
  actors: getUpdatedActors(level.actors, parentId, template),
}))
