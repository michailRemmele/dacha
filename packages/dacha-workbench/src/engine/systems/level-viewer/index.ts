import {
  System,
  ActorCollection,
  ActorCreator,
  TemplateCollection,
} from 'remiz'
import type {
  Scene,
  SystemOptions,
  ActorSpawner,
  TemplateConfig,
  LevelConfig,
} from 'remiz'

import { EventType } from '../../../events'
import type { SelectLevelEvent } from '../../../events'
import type { EditorConfig } from '../../../types/global'
import type { Store, ListenerFn } from '../../../store'
import { includesArray } from '../../../utils/includes-array'
import { getAncestor } from '../../../utils/get-ancestor'

import { ALLOWED_COMPONENTS } from './consts'
import { omit } from './utils'
import {
  watchTemplates,
  watchActors,
} from './watchers'
import type { WatcherOptions } from './watchers'

interface LevelViewerOptions extends SystemOptions {
  mainActorId: string;
}

export class LevelViewer extends System {
  scene: Scene
  actorSpawner: ActorSpawner
  actorCollection: ActorCollection
  mainActorId: string
  configStore: Store
  editorConfig: EditorConfig
  actorCreator: ActorCreator
  currentLevel?: string
  templateCollection: TemplateCollection
  subscription?: () => void
  prevLevel?: LevelConfig

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      actorSpawner,
      mainActorId,
    } = options as LevelViewerOptions

    this.scene = scene
    this.actorSpawner = actorSpawner
    this.actorCollection = new ActorCollection(scene)
    this.mainActorId = mainActorId

    this.configStore = scene.data.configStore as Store
    this.editorConfig = scene.data.editorConfig as EditorConfig

    const mainActor = this.actorCollection.getById(this.mainActorId)

    if (!mainActor) {
      throw new Error('Can\'t find the main actor')
    }

    this.scene.data.mainActor = mainActor

    const templateCollection = new TemplateCollection(ALLOWED_COMPONENTS)
    const templates = this.configStore.get(['templates']) as Array<TemplateConfig>

    templates.forEach((template) => {
      templateCollection.register(omit(template))
    })

    this.templateCollection = templateCollection
    this.actorCreator = new ActorCreator(ALLOWED_COMPONENTS, templateCollection)

    this.scene.data.actorCreator = this.actorCreator
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.watchStore()
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.subscription?.()
  }

  private watchStore(): void {
    const listener: ListenerFn = (path) => {
      const levelPath = this.currentLevel && ['levels', `id:${this.currentLevel}`]
      const level = levelPath ? this.configStore.get(levelPath) as LevelConfig : undefined

      const options: WatcherOptions = {
        path,
        store: this.configStore,
        scene: this.scene,
        actorCollection: this.actorCollection,
        actorCreator: this.actorCreator,
        templateCollection: this.templateCollection,
        level,
        prevLevel: this.prevLevel,
      }

      if (includesArray(path, ['templates'])) {
        watchTemplates(options)
      }
      if (this.currentLevel && includesArray(path, ['levels'])) {
        watchActors(options)
      }

      this.prevLevel = level
    }

    this.subscription = this.configStore.subscribe(listener)
  }

  private handleSelectLevel = (event: SelectLevelEvent): void => {
    const { levelId } = event

    if (this.currentLevel === levelId) {
      return
    }

    this.actorCollection.forEach((actor) => {
      if (getAncestor(actor).id !== this.mainActorId) {
        actor.remove()
      }
    })

    const levels = this.configStore.get(['levels']) as Array<LevelConfig>
    const selectedLevel = levels.find((level) => level.id === levelId)

    const { actorCreator } = this

    if (selectedLevel && actorCreator) {
      selectedLevel.actors.forEach((actorConfig) => {
        this.scene.appendChild(actorCreator.create(omit(actorConfig)))
      })
    }

    this.prevLevel = selectedLevel
    this.currentLevel = levelId
  }
}

LevelViewer.systemName = 'LevelViewer'
