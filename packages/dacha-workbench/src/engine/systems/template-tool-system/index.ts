import type {
  System,
  SystemOptions,
  MessageBus,
  SceneContext,
  TemplateConfig,
  LevelConfig,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectCreator,
} from 'remiz'

import {
  SELECT_LEVEL_MSG,
  ADD_FROM_TEMPLATE_MSG,
  COMMAND_MSG,
  TOOL_CURSOR_MOVE_MSG,
  TOOL_CURSOR_LEAVE_MSG,
} from '../../../consts/message-types'
import { ADD } from '../../../command-types'
import type {
  SelectLevelMessage,
  MouseInputMessage,
} from '../../../types/messages'
import type { Store } from '../../../store'

import { PreviewSubsystem } from './preview'
import { createFromTemplate, updatePlacementPosition } from './utils'
import { getTool } from '../../../utils/get-tool'
import type { Position } from './types'

export class TemplateToolSystem implements System {
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private configStore: Store
  private gameObjectSpawner: GameObjectSpawner
  private gameObjectDestroyer: GameObjectDestroyer
  private previewSubsystem?: PreviewSubsystem

  private selectedLevelId?: string

  private cursor: Position
  private placementPosition: Position

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

    this.cursor = { x: 0, y: 0 }
    this.placementPosition = { x: 0, y: 0 }
  }

  mount(): void {
    this.previewSubsystem = new PreviewSubsystem({
      gameObjectCreator: this.sceneContext.data.gameObjectCreator as GameObjectCreator,
      gameObjectDestroyer: this.gameObjectDestroyer,
      gameObjectSpawner: this.gameObjectSpawner,
      sceneContext: this.sceneContext,
      messageBus: this.messageBus,
    })
  }

  unmount(): void {
    this.previewSubsystem?.unmount()
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined
    if (!messages) {
      return
    }

    const { levelId } = messages[0]

    this.selectedLevelId = levelId
  }

  private handleCursorMoveMessages(): void {
    const messages = this.messageBus.get(TOOL_CURSOR_MOVE_MSG)
    if (!messages?.length) {
      return
    }

    const { x, y } = messages.at(-1) as MouseInputMessage
    this.cursor.x = x
    this.cursor.y = y
  }

  private handleCursorLeaveMessages(): void {
    const messages = this.messageBus.get(TOOL_CURSOR_LEAVE_MSG)
    if (!messages?.length) {
      return
    }

    this.cursor.x = null
    this.cursor.y = null
  }

  private handleAddMessages(levelId: string): void {
    const messages = this.messageBus.get(ADD_FROM_TEMPLATE_MSG)
    if (!messages?.length) {
      return
    }

    const { x, y } = messages.at(-1) as MouseInputMessage
    this.cursor.x = x
    this.cursor.y = y
    updatePlacementPosition(
      this.cursor,
      this.placementPosition,
      this.configStore,
      this.sceneContext,
    )

    const tool = getTool(this.sceneContext)

    const templateId = tool.features.templateId.value as string | undefined
    if (templateId === undefined) {
      return
    }

    const template = this.configStore.get(['templates', `id:${templateId}`]) as TemplateConfig
    const level = this.configStore.get(['levels', `id:${levelId}`]) as LevelConfig

    const gameObject = createFromTemplate(
      template,
      level,
      this.placementPosition.x || 0,
      this.placementPosition.y || 0,
    )

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
    this.handleCursorMoveMessages()
    this.handleCursorLeaveMessages()

    const levelId = this.selectedLevelId
    if (levelId === undefined) {
      return
    }

    updatePlacementPosition(
      this.cursor,
      this.placementPosition,
      this.configStore,
      this.sceneContext,
    )

    this.previewSubsystem?.update(this.placementPosition.x, this.placementPosition.y)

    this.handleAddMessages(levelId)
  }
}
