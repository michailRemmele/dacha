import type {
  LevelConfig,
  Scene,
  ActorCollection,
  ActorCreator,
  TemplateCollection,
} from 'dacha'
import type { CommanderStore } from '../../../../store'

export interface WatcherOptions {
  path: Array<string>,
  store: CommanderStore,
  scene: Scene,
  actorCollection: ActorCollection,
  actorCreator: ActorCreator,
  templateCollection: TemplateCollection,
  level?: LevelConfig,
  prevLevel?: LevelConfig,
}

export type WatcherFn = (options: WatcherOptions) => void
