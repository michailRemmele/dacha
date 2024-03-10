import type {
  LevelConfig,
  Scene,
  ActorCollection,
  ActorCreator,
  TemplateCollection,
} from 'remiz'
import type { Store } from '../../../../store'

export interface WatcherOptions {
  path: Array<string>,
  store: Store,
  scene: Scene,
  actorCollection: ActorCollection,
  actorCreator: ActorCreator,
  templateCollection: TemplateCollection,
  level?: LevelConfig,
  prevLevel?: LevelConfig,
}

export type WatcherFn = (options: WatcherOptions) => void
