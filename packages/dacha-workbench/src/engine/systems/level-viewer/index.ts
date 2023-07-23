import {
  System,
  SystemOptions,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectObserver,
  contribComponents,
  GameObjectCreator,
  TemplateCollection,
  TemplateConfig,
  LevelConfig,
  MessageBus,
  SceneContext,
  ComponentsMap,
} from 'remiz'

import type { EditorConfig, Extension } from '../../../types/global'
import type { Store, ListenerFn } from '../../../store'
import type { SelectLevelMessage } from '../../../types/messages'
import { SELECT_LEVEL_MSG } from '../../../consts/message-types'
import { includesArray } from '../../../utils/includes-array'

import {
  watchTemplates,
  watchGameObjects,
} from './watchers'
import type { WatcherOptions } from './watchers'

interface LevelViewerOptions extends SystemOptions {
  mainObjectId: string;
}

export class LevelViewer implements System {
  messageBus: MessageBus
  sceneContext: SceneContext
  gameObjectSpawner: GameObjectSpawner
  gameObjectDestroyer: GameObjectDestroyer
  gameObjectObserver: GameObjectObserver
  mainObjectId: string
  configStore: Store
  editorConfig: EditorConfig
  projectComponents: ComponentsMap
  gameObjectCreator?: GameObjectCreator
  currentLevel?: string
  templateCollection?: TemplateCollection
  subscription?: () => void
  prevLevel?: LevelConfig

  constructor(options: SystemOptions) {
    const {
      messageBus,
      sceneContext,
      gameObjectSpawner,
      gameObjectDestroyer,
      createGameObjectObserver,
      mainObjectId,
    } = options as LevelViewerOptions

    this.messageBus = messageBus
    this.sceneContext = sceneContext
    this.gameObjectSpawner = gameObjectSpawner
    this.gameObjectDestroyer = gameObjectDestroyer
    this.gameObjectObserver = createGameObjectObserver({})
    this.mainObjectId = mainObjectId

    this.configStore = this.sceneContext.data.configStore as Store
    this.editorConfig = sceneContext.data.editorConfig as EditorConfig

    const mainObject = this.gameObjectObserver.getById(this.mainObjectId)

    if (!mainObject) {
      throw new Error('Can\'t find the main object')
    }

    this.sceneContext.data.mainObject = mainObject

    this.projectComponents = {}
  }

  mount(): void {
    if (this.sceneContext.data.extension) {
      const extension = this.sceneContext.data.extension as Extension
      this.projectComponents = extension.components as ComponentsMap
    }

    const components = {
      ...contribComponents,
      ...this.projectComponents,
    }

    const templateCollection = new TemplateCollection(components)
    const templates = this.configStore.get(['templates']) as Array<TemplateConfig>

    templates.forEach((template) => {
      templateCollection.register(template)
    })

    this.templateCollection = templateCollection
    this.gameObjectCreator = new GameObjectCreator(components, templateCollection)

    this.sceneContext.data.gameObjectCreator = this.gameObjectCreator

    this.watchStore()
  }

  unmount(): void {
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
        gameObjectDestroyer: this.gameObjectDestroyer,
        gameObjectCreator: this.gameObjectCreator as GameObjectCreator,
        gameObjectSpawner: this.gameObjectSpawner,
        templateCollection: this.templateCollection as TemplateCollection,
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

  private updateLevels(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined

    if (!messages) {
      return
    }

    const { levelId } = messages[messages.length - 1]

    if (this.currentLevel === levelId) {
      return
    }

    this.gameObjectObserver.getList().forEach((gameObject) => {
      if (gameObject.getAncestor().id !== this.mainObjectId) {
        this.gameObjectDestroyer.destroy(gameObject)
      }
    })

    const levels = this.configStore.get(['levels']) as Array<LevelConfig>
    const selectedLevel = levels.find((level) => level.id === levelId)

    const { gameObjectCreator } = this

    if (selectedLevel && gameObjectCreator) {
      selectedLevel.gameObjects.forEach((gameObjectConfig) => {
        const gameObject = gameObjectCreator.create(gameObjectConfig)

        this.gameObjectSpawner.spawn(gameObject)
      })
    }

    this.prevLevel = selectedLevel
    this.currentLevel = levelId
  }

  update(): void {
    this.updateLevels()
  }
}
