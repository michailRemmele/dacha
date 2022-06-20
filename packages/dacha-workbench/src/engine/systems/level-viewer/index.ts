import {
  System,
  SystemOptions,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectObserver,
  contribComponents,
  GameObjectCreator,
  TemplateCollection,
  Config,
  Message,
  MessageBus,
  SceneContext,
  ComponentsMap,
} from 'remiz'

import type { EditorConfig } from '../../../types/global'

const CAMERA_ID = 'main-camera-id'

const SELECT_LEVEL_MSG = 'SELECT_LEVEL'

interface SelectLevelMessage extends Message {
  name: string
}

export class LevelViewer implements System {
  messageBus: MessageBus
  sceneContext: SceneContext
  gameObjectSpawner: GameObjectSpawner
  gameObjectDestroyer: GameObjectDestroyer
  gameObjectObserver: GameObjectObserver
  projectConfig: Config
  editorConfig: EditorConfig
  projectComponents: ComponentsMap
  gameObjectCreator?: GameObjectCreator
  currentLevel?: string

  constructor(options: SystemOptions) {
    this.messageBus = options.messageBus
    this.sceneContext = options.sceneContext
    this.gameObjectSpawner = options.gameObjectSpawner
    this.gameObjectDestroyer = options.gameObjectDestroyer
    this.gameObjectObserver = options.createGameObjectObserver({})

    this.projectConfig = options.sceneContext.data.projectConfig as Config
    this.editorConfig = options.sceneContext.data.editorConfig as EditorConfig

    this.projectComponents = {}
  }

  mount(): void {
    if (this.sceneContext.data.projectComponents) {
      this.projectComponents = this.sceneContext.data.projectComponents as ComponentsMap
    }

    const components = {
      ...contribComponents,
      ...this.projectComponents,
    }

    const templateCollection = new TemplateCollection(components)

    this.projectConfig.templates.forEach((template) => {
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
      if (gameObject.id !== CAMERA_ID) {
        this.gameObjectDestroyer.destroy(gameObject)
      }
    })

    const selectedLevel = this.projectConfig?.levels.find((level) => level.name === name)

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
