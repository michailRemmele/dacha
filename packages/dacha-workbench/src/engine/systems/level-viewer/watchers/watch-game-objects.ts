import type {
  GameObjectConfig,
  LevelConfig,
} from 'remiz'

import { omit } from '../utils'

import type { WatcherFn, WatcherOptions } from './types'

const GAME_OBJECT_PATH_LENGTH = 4
const LEVEL_OBJECTS_PATH_LENGTH = 3

const getDiff = (
  first: Array<GameObjectConfig>,
  second: Array<GameObjectConfig>,
): Array<GameObjectConfig> => {
  const gameObjectsMap = second
    .reduce((acc, gameObject) => acc.add(gameObject.id), new Set<string>())

  return first
    .filter((gameObject) => !gameObjectsMap.has(gameObject.id))
}

const syncGameObjects = ({
  level,
  prevLevel,
  gameObjectObserver,
  gameObjectCreator,
  gameObjectSpawner,
}: WatcherOptions): void => {
  const { gameObjects } = level as LevelConfig
  const { gameObjects: prevGameObjects } = prevLevel as LevelConfig

  const gameObjectsToAdd = getDiff(gameObjects, prevGameObjects)
  const gameObjectsToDelete = getDiff(prevGameObjects, gameObjects)

  gameObjectsToDelete.forEach((gameObjectConfig) => {
    const gameObject = gameObjectObserver.getById(gameObjectConfig.id)
    gameObject?.destroy()
  })
  gameObjectsToAdd.forEach((gameObjectConfig) => {
    gameObjectSpawner.spawn(gameObjectCreator.create(omit(gameObjectConfig)))
  })
}

export const watchGameObjects: WatcherFn = (options): void => {
  const {
    path,
    store,
    gameObjectObserver,
    gameObjectCreator,
    gameObjectSpawner,
    level,
  } = options

  if (!level) {
    return
  }

  if (path.length <= LEVEL_OBJECTS_PATH_LENGTH) {
    syncGameObjects(options)
    return
  }

  const gameObjectPath = path.slice(0, GAME_OBJECT_PATH_LENGTH)
  const gameObjectConfig = store.get(gameObjectPath) as GameObjectConfig | undefined

  if (gameObjectConfig === undefined) {
    syncGameObjects(options)
    return
  }

  const gameObject = gameObjectObserver.getById(gameObjectConfig.id)

  if (gameObject) {
    gameObject.destroy()
    gameObjectSpawner.spawn(gameObjectCreator.create(omit(gameObjectConfig)))
  }
}
