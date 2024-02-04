import {
  System,
  GameObjectObserver,
  GameObjectCreator,
  TemplateCollection,
} from 'remiz'
import type {
  Scene,
  SystemOptions,
  GameObjectSpawner,
  TemplateConfig,
  LevelConfig,
} from 'remiz'

import { EventType } from '../../../events'
import type { SelectLevelEvent } from '../../../events'
import type { EditorConfig } from '../../../types/global'
import type { Store, ListenerFn } from '../../../store'
import { includesArray } from '../../../utils/includes-array'

import { ALLOWED_COMPONENTS } from './consts'
import { omit } from './utils'
import {
  watchTemplates,
  watchGameObjects,
} from './watchers'
import type { WatcherOptions } from './watchers'

interface LevelViewerOptions extends SystemOptions {
  mainObjectId: string;
}

export class LevelViewer extends System {
  scene: Scene
  gameObjectSpawner: GameObjectSpawner
  gameObjectObserver: GameObjectObserver
  mainObjectId: string
  configStore: Store
  editorConfig: EditorConfig
  gameObjectCreator: GameObjectCreator
  currentLevel?: string
  templateCollection: TemplateCollection
  subscription?: () => void
  prevLevel?: LevelConfig

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      gameObjectSpawner,
      mainObjectId,
    } = options as LevelViewerOptions

    this.scene = scene
    this.gameObjectSpawner = gameObjectSpawner
    this.gameObjectObserver = new GameObjectObserver(scene)
    this.mainObjectId = mainObjectId

    this.configStore = scene.data.configStore as Store
    this.editorConfig = scene.data.editorConfig as EditorConfig

    const mainObject = this.gameObjectObserver.getById(this.mainObjectId)

    if (!mainObject) {
      throw new Error('Can\'t find the main object')
    }

    this.scene.data.mainObject = mainObject

    const templateCollection = new TemplateCollection(ALLOWED_COMPONENTS)
    const templates = this.configStore.get(['templates']) as Array<TemplateConfig>

    templates.forEach((template) => {
      templateCollection.register(omit(template))
    })

    this.templateCollection = templateCollection
    this.gameObjectCreator = new GameObjectCreator(ALLOWED_COMPONENTS, templateCollection)

    this.scene.data.gameObjectCreator = this.gameObjectCreator
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
        gameObjectObserver: this.gameObjectObserver,
        gameObjectCreator: this.gameObjectCreator,
        gameObjectSpawner: this.gameObjectSpawner,
        templateCollection: this.templateCollection,
        level,
        prevLevel: this.prevLevel,
      }

      if (includesArray(path, ['templates'])) {
        watchTemplates(options)
      }
      if (this.currentLevel && includesArray(path, ['levels'])) {
        watchGameObjects(options)
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

    this.gameObjectObserver.forEach((gameObject) => {
      if (gameObject.getAncestor().id !== this.mainObjectId) {
        gameObject.destroy()
      }
    })

    const levels = this.configStore.get(['levels']) as Array<LevelConfig>
    const selectedLevel = levels.find((level) => level.id === levelId)

    const { gameObjectCreator } = this

    if (selectedLevel && gameObjectCreator) {
      selectedLevel.gameObjects.forEach((gameObjectConfig) => {
        this.gameObjectSpawner.spawn(gameObjectCreator.create(omit(gameObjectConfig)))
      })
    }

    this.prevLevel = selectedLevel
    this.currentLevel = levelId
  }
}

LevelViewer.systemName = 'LevelViewer'
