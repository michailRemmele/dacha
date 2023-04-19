import type {
  LevelConfig,
  GameObjectObserver,
  GameObjectDestroyer,
  GameObjectCreator,
  GameObjectSpawner,
  TemplateCollection,
} from 'remiz'
import type { Store } from '../../../../store'

export interface WatcherOptions {
  path: Array<string>,
  store: Store,
  gameObjectObserver: GameObjectObserver,
  gameObjectDestroyer: GameObjectDestroyer,
  gameObjectCreator: GameObjectCreator,
  gameObjectSpawner: GameObjectSpawner,
  templateCollection: TemplateCollection,
  level?: LevelConfig,
  prevLevel?: LevelConfig,
}

export type WatcherFn = (options: WatcherOptions) => void
