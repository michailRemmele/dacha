import type {
  ActorConfig,
  LevelConfig,
} from 'remiz'

import { omit } from '../utils'

import type { WatcherFn, WatcherOptions } from './types'

const ACTOR_PATH_LENGTH = 4
const LEVEL_OBJECTS_PATH_LENGTH = 3

const getDiff = (
  first: Array<ActorConfig>,
  second: Array<ActorConfig>,
): Array<ActorConfig> => {
  const actorsMap = second
    .reduce((acc, actor) => acc.add(actor.id), new Set<string>())

  return first
    .filter((actor) => !actorsMap.has(actor.id))
}

const syncActors = ({
  level,
  prevLevel,
  scene,
  actorCollection,
  actorCreator,
}: WatcherOptions): void => {
  const { actors } = level as LevelConfig
  const { actors: prevActors } = prevLevel as LevelConfig

  const actorsToAdd = getDiff(actors, prevActors)
  const actorsToDelete = getDiff(prevActors, actors)

  actorsToDelete.forEach((actorConfig) => {
    const actor = actorCollection.getById(actorConfig.id)
    actor?.remove()
  })
  actorsToAdd.forEach((actorConfig) => {
    scene.appendChild(actorCreator.create(omit(actorConfig)))
  })
}

export const watchActors: WatcherFn = (options): void => {
  const {
    path,
    store,
    scene,
    actorCollection,
    actorCreator,
    level,
  } = options

  if (!level) {
    return
  }

  if (path.length <= LEVEL_OBJECTS_PATH_LENGTH) {
    syncActors(options)
    return
  }

  const actorPath = path.slice(0, ACTOR_PATH_LENGTH)
  const actorConfig = store.get(actorPath) as ActorConfig | undefined

  if (actorConfig === undefined) {
    syncActors(options)
    return
  }

  const actor = actorCollection.getById(actorConfig.id)

  if (actor) {
    actor.remove()
    scene.appendChild(actorCreator.create(omit(actorConfig)))
  }
}
