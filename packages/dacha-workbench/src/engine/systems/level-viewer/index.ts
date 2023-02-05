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
    const templatesPath = ['templates']

    const listener: ListenerFn = (path) => {
      const { templateCollection, gameObjectCreator } = this
      if (includesArray(path, templatesPath) && templateCollection && gameObjectCreator) {
        this.watchTemplates(path, templateCollection, gameObjectCreator)
      }
    }

    this.subscription = this.configStore.subscribe(listener)
  }

  private watchTemplates(
    path: Array<string>,
    templateCollection: TemplateCollection,
    gameObjectCreator: GameObjectCreator,
  ): void {
    const templatePath = path.slice(0, 2)
    const template = this.configStore.get(templatePath) as TemplateConfig

    templateCollection.delete(template.id)
    templateCollection.register(template)

    if (!this.currentLevel) {
      return
    }

    const levelPath = ['levels', `id:${this.currentLevel}`]
    const { gameObjects } = this.configStore.get(levelPath) as LevelConfig

    const gameObjectsMap = gameObjects.reduce((acc, gameObjectConfig) => {
      if (template.id === gameObjectConfig.templateId) {
        acc[gameObjectConfig.id] = gameObjectConfig
      }
      return acc
    }, {} as Record<string, GameObjectConfig>)

    this.gameObjectObserver.getList().forEach((gameObject) => {
      if (template.id === gameObject.templateId) {
        this.gameObjectDestroyer.destroy(gameObject)

        const newGameObject = gameObjectCreator.create(gameObjectsMap[gameObject.id])
        this.gameObjectSpawner.spawn(newGameObject)
      }
    })
  }

  private updateLevels(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined

    if (!messages) {
      return
    }

    const { id } = messages[messages.length - 1]

    if (this.currentLevel === id) {
      return
    }

    this.gameObjectObserver.getList().forEach((gameObject) => {
      if (gameObject.getAncestor().id !== this.mainObjectId) {
        this.gameObjectDestroyer.destroy(gameObject)
      }
    })

    const levels = this.configStore.get(['levels']) as Array<LevelConfig>
    const selectedLevel = levels.find((level) => level.id === id)

    const { gameObjectCreator } = this

    if (selectedLevel && gameObjectCreator) {
      selectedLevel.gameObjects.forEach((gameObjectConfig) => {
        const gameObject = gameObjectCreator.create(gameObjectConfig)

        this.gameObjectSpawner.spawn(gameObject)
      })
    }

    this.currentLevel = id
  }

  update(): void {
    this.updateLevels()
  }
}
