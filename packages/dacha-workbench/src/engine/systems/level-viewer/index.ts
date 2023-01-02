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
import type { Mutator } from '../../../mutator'
import type { SelectLevelMessage } from '../../../types/messages'
import { SELECT_LEVEL_MSG } from '../../../consts/message-types'

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
  mutator: Mutator
  editorConfig: EditorConfig
  projectComponents: ComponentsMap
  gameObjectCreator?: GameObjectCreator
  currentLevel?: string

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

    this.mutator = this.sceneContext.data.mutator as Mutator
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
    const templates = this.mutator.get(['templates']) as Array<TemplateConfig>

    templates.forEach((template) => {
      templateCollection.register(template)
    })

    this.gameObjectCreator = new GameObjectCreator(components, templateCollection)
  }

  update(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined

    if (!messages) {
      return
    }

    const { name } = messages[messages.length - 1]

    if (this.currentLevel === name) {
      return
    }

    this.gameObjectObserver.getList().forEach((gameObject) => {
      if (gameObject.getAncestor().id !== this.mainObjectId) {
        this.gameObjectDestroyer.destroy(gameObject)
      }
    })

    const levels = this.mutator.get(['levels']) as Array<LevelConfig>
    const selectedLevel = levels.find((level) => level.name === name)

    const gameObjectCreator = this.gameObjectCreator

    if (selectedLevel && gameObjectCreator) {
      selectedLevel.gameObjects.forEach((gameObjectConfig) => {
        const gameObject = gameObjectCreator.create(gameObjectConfig)

        this.gameObjectSpawner.spawn(gameObject)
      })
    }

    this.currentLevel = name
  }
}
