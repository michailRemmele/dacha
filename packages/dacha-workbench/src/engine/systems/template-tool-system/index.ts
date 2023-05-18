import type {
  System,
  SystemOptions,
  GameObject,
  MessageBus,
  Message,
  SceneContext,
  TemplateConfig,
  LevelConfig,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectCreator,
  Transform,
} from 'remiz'

import {
  SELECT_LEVEL_MSG,
  ADD_FROM_TEMPLATE_MSG,
  TEMPLATE_PREVIEW_MOVE_MSG,
  TEMPLATE_PREVIEW_HIDE_MSG,
  COMMAND_MSG,
} from '../../../consts/message-types'
import { ADD } from '../../../command-types'
import type { SelectLevelMessage } from '../../../types/messages'
import type { Tool } from '../../components'
import type { Store } from '../../../store'

import { createFromTemplate } from './utils'
import {
  TOOL_COMPONENT_NAME,
  TOOL_NAME,
  TRANSFORM_COMPONENT_NAME,
} from './consts'

interface MouseInputMessage extends Message {
  screenX: number
  screenY: number
  x: number
  y: number
}

export class TemplateToolSystem implements System {
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private mainObject: GameObject
  private configStore: Store
  private gameObjectSpawner: GameObjectSpawner
  private gameObjectDestroyer: GameObjectDestroyer
  private gameObjectCreator?: GameObjectCreator

  private selectedLevelId?: string

  private preview?: GameObject

  constructor(options: SystemOptions) {
    const {
      messageBus,
      sceneContext,
      gameObjectSpawner,
      gameObjectDestroyer,
    } = options

    this.messageBus = messageBus
    this.sceneContext = sceneContext
    this.configStore = this.sceneContext.data.configStore as Store
    this.gameObjectSpawner = gameObjectSpawner
    this.gameObjectDestroyer = gameObjectDestroyer

    this.mainObject = sceneContext.data.mainObject as GameObject
  }

  mount(): void {
    this.gameObjectCreator = this.sceneContext.data.gameObjectCreator as GameObjectCreator
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined
    if (!messages) {
      return
    }

    const { levelId } = messages[0]

    this.selectedLevelId = levelId
  }

  private deletePreview(): void {
    if (this.preview === undefined) {
      return
    }

    this.gameObjectDestroyer.destroy(this.preview)
    this.preview = undefined
  }

  // TODO: Simplify after gameObject/template creation refactoring
  private spawnPreview(templateId: string): GameObject {
    const gameObjectCreator = this.gameObjectCreator as GameObjectCreator

    const preview = gameObjectCreator.create({
      templateId,
      fromTemplate: true,
      isNew: true,
    })
    this.gameObjectSpawner.spawn(preview)
    this.mainObject.appendChild(preview)

    return preview
  }

  private updatePreview(tool: Tool, x: number, y: number): void {
    const templateId = tool.features.templateId.value as string

    if (this.preview !== undefined && this.preview.templateId !== templateId) {
      this.deletePreview()
    }
    // TODO: Recreate preview if template was changed
    if (this.preview === undefined) {
      this.preview = this.spawnPreview(templateId)
    }

    const transform = this.preview.getComponent(TRANSFORM_COMPONENT_NAME) as Transform | undefined
    if (transform !== undefined) {
      transform.offsetX = Math.round(x)
      transform.offsetY = Math.round(y)
    }
  }

  private handleMoveMessages(tool: Tool): void {
    const messages = this.messageBus.get(TEMPLATE_PREVIEW_MOVE_MSG)
    if (!messages?.length) {
      return
    }

    const { x, y } = messages.at(-1) as MouseInputMessage

    this.updatePreview(tool, x, y)
  }

  private handleHideMessages(): void {
    const messages = this.messageBus.get(TEMPLATE_PREVIEW_HIDE_MSG)
    if (!messages?.length) {
      return
    }

    this.deletePreview()
  }

  private handleAddMessages(levelId: string, tool: Tool): void {
    const messages = this.messageBus.get(ADD_FROM_TEMPLATE_MSG)
    if (!messages?.length) {
      return
    }

    const { x, y } = messages.at(-1) as MouseInputMessage

    const templateId = tool.features.templateId.value as string

    const template = this.configStore.get(['templates', `id:${templateId}`]) as TemplateConfig
    const level = this.configStore.get(['levels', `id:${levelId}`]) as LevelConfig

    const gameObject = createFromTemplate(template, level, x, y)

    this.messageBus.send({
      type: COMMAND_MSG,
      command: ADD,
      options: {
        path: ['levels', `id:${levelId}`, 'gameObjects'],
        value: gameObject,
      },
    })
  }

  update(): void {
    this.handleLevelChange()

    const levelId = this.selectedLevelId
    if (levelId === undefined) {
      return
    }

    const toolObjectId = this.sceneContext.data.currentToolObjectId as string
    const toolObject = this.mainObject.getChildById(toolObjectId) as GameObject
    const toolComponent = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

    // TODO: Probably it is required to add some message about tool switching
    // to add preview by mouse coordinates
    // ?Can you check mouse coordinates at any time
    // or you need to track it manually by listening mouse event?
    // Probably this system should always listen mouse move event directly and track x,y coordinates

    // TODO: Move preview management to subsystem
    if (toolComponent.name !== TOOL_NAME) {
      this.deletePreview()
      return
    }

    const preview = toolComponent.features.preview.value as boolean
    if (preview) {
      this.handleMoveMessages(toolComponent)
      this.handleHideMessages()
    } else {
      this.deletePreview()
    }

    this.handleAddMessages(levelId, toolComponent)
  }
}
