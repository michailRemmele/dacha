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
  GameObjectConfig,
  MessageBus,
  SceneContext,
  ComponentsMap,
} from 'remiz'

import type { EditorConfig, Extension } from '../../../types/global'
import type { Store, ListenerFn } from '../../../store'
import type { SelectLevelMessage } from '../../../types/messages'
import { SELECT_LEVEL_MSG } from '../../../consts/message-types'
import { includesArray } from '../../../utils/includes-array'

const TEMPLATE_PATH_LENGTH = 2
const GAME_OBJECT_PATH_LENGTH = 4

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

    this.watchStore()
  }

  unmount(): void {
    this.subscription?.()
  }

  private watchStore(): void {
    const listener: ListenerFn = (path) => {
      if (includesArray(path, ['templates'])) {
        this.watchTemplates(path)
      }
      if (this.currentLevel && includesArray(path, ['levels', `id:${this.currentLevel}`, 'gameObjects'])) {
        this.watchGameObjects(path)
      }
    }

    this.subscription = this.configStore.subscribe(listener)
  }

  private watchTemplates(path: Array<string>): void {
    const templatePath = path.slice(0, TEMPLATE_PATH_LENGTH)
    const template = this.configStore.get(templatePath) as TemplateConfig

    this.templateCollection?.delete(template.id)
    this.templateCollection?.register(template)

    if (!this.currentLevel) {
      return
    }

    const levelPath = ['levels', `id:${this.currentLevel}`]
    const { gameObjects } = this.configStore.get(levelPath) as LevelConfig

    gameObjects.forEach((gameObjectConfig) => {
      if (template.id !== gameObjectConfig.templateId) {
        return
      }

      const gameObject = this.gameObjectObserver.getById(gameObjectConfig.id)

      if (gameObject) {
        this.gameObjectDestroyer.destroy(gameObject)
        this.gameObjectSpawner.spawn(this.gameObjectCreator!.create(gameObjectConfig))
      }
    })
  }

  private watchGameObjects(path: Array<string>): void {
    const gameObjectPath = path.slice(0, GAME_OBJECT_PATH_LENGTH)
    const gameObjectConfig = this.configStore.get(gameObjectPath) as GameObjectConfig

    const gameObject = this.gameObjectObserver.getById(gameObjectConfig.id)

    if (gameObject) {
      this.gameObjectDestroyer.destroy(gameObject)
      this.gameObjectSpawner.spawn(this.gameObjectCreator!.create(gameObjectConfig))
    }
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

    this.currentLevel = levelId
  }

  update(): void {
    this.updateLevels()
  }
}
