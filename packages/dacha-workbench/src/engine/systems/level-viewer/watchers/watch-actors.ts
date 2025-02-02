import type { LevelConfig } from 'dacha'

import { omit } from '../utils'

import type { WatcherFn, WatcherOptions } from './types'

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
  const { level } = options
  if (!level) {
    return
  }

  syncActors(options)
}
