import type { SceneConfig } from 'dacha'

import { omit } from '../utils'

import type { WatcherFn, WatcherOptions } from './types'

const syncActors = ({
  scene,
  prevScene,
  editorScene,
  actorCollection,
  actorCreator,
}: WatcherOptions): void => {
  const { actors } = scene as SceneConfig
  const { actors: prevActors } = prevScene as SceneConfig

  prevActors.forEach((actorConfig) => {
    const actor = actorCollection.getById(actorConfig.id)
    actor?.remove()
  })
  actors.forEach((actorConfig) => {
    editorScene.appendChild(actorCreator.create(omit(actorConfig)))
  })
}

export const watchActors: WatcherFn = (options): void => {
  const { scene } = options
  if (!scene) {
    return
  }

  syncActors(options)
}
