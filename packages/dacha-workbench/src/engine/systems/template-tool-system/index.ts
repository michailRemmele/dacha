import {
  System,
  SystemOptions,
  GameObject,
  MessageBus,
  Message,
  SceneContext,
  TemplateConfig,
  LevelConfig,
} from 'remiz'

import {
  SELECT_LEVEL_MSG,
  ADD_FROM_TEMPLATE_MSG,
  COMMAND_MSG,
} from '../../../consts/message-types'
import { ADD } from '../../../command-types'
import type { SelectLevelMessage } from '../../../types/messages'
import type { Tool } from '../../components'
import type { Store } from '../../../store'

import { createFromTemplate } from './utils'

const TOOL_COMPONENT_NAME = 'tool'

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

  private selectedLevelId?: string

  constructor(options: SystemOptions) {
    const { messageBus, sceneContext } = options

    this.messageBus = messageBus
    this.sceneContext = sceneContext
    this.configStore = this.sceneContext.data.configStore as Store

    this.mainObject = sceneContext.data.mainObject as GameObject
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined
    if (!messages) {
      return
    }

    const { levelId } = messages[0]

    this.selectedLevelId = levelId
  }

  private handleAddMessages(): void {
    if (this.selectedLevelId === undefined) {
      return
    }

    const messages = this.messageBus.get(ADD_FROM_TEMPLATE_MSG)
    if (!messages?.length) {
      return
    }

    const { x, y } = messages.at(-1) as MouseInputMessage

    const toolObjectId = this.sceneContext.data.currentToolObjectId as string
    const toolObject = this.mainObject.getChildById(toolObjectId) as GameObject
    const toolComponent = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

    const templateId = toolComponent.features.templateId.value as string

    const template = this.configStore.get(['templates', `id:${templateId}`]) as TemplateConfig
    const level = this.configStore.get(['levels', `id:${this.selectedLevelId}`]) as LevelConfig

    const gameObject = createFromTemplate(template, level, x, y)

    this.messageBus.send({
      type: COMMAND_MSG,
      command: ADD,
      options: {
        path: ['levels', `id:${this.selectedLevelId}`, 'gameObjects'],
        value: gameObject,
      },
    })
  }

  update(): void {
    this.handleLevelChange()
    this.handleAddMessages()
  }
}
