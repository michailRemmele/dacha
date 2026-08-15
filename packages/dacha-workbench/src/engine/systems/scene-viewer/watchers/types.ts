import type {
  SceneConfig,
  Scene,
  ActorCollection,
  ActorCreator,
  TemplateCollection,
} from 'dacha'
import type { CommanderStore } from '../../../../store'

export interface WatcherOptions {
  path: string[],
  store: CommanderStore,
  editorScene: Scene,
  actorCollection: ActorCollection,
  actorCreator: ActorCreator,
  templateCollection: TemplateCollection,
  scene?: SceneConfig,
  prevScene?: SceneConfig,
}

export type WatcherFn = (options: WatcherOptions) => void
