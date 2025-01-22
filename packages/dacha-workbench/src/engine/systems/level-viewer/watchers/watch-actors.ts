import type {
  ActorConfig,
  LevelConfig,
} from 'dacha'

import { omit } from '../utils'

import type { WatcherFn, WatcherOptions } from './types'

const ACTOR_PATH_LENGTH = 4
const LEVEL_OBJECTS_PATH_LENGTH = 3

const syncActors = ({
  level,
  prevLevel,
  scene,
  actorCollection,
  actorCreator,
}: WatcherOptions): void => {
  const { actors } = level as LevelConfig
  const { actors: prevActors } = prevLevel as LevelConfig

  prevActors.forEach((actorConfig) => {
    const actor = actorCollection.getById(actorConfig.id)
    actor?.remove()
  })
  actors.forEach((actorConfig) => {
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
    const removedActor = actorCollection.getById((actorPath.at(-1) as string).split(':')[1])
    removedActor?.remove()
    return
  }

  const actor = actorCollection.getById(actorConfig.id)

  if (actor) {
    actor.remove()
    scene.appendChild(actorCreator.create(omit(actorConfig)))
  }
}
