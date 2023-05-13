import {
  System,
  SystemOptions,
  GameObject,
  MessageBus,
  Message,
  SceneContext,
} from 'remiz'

import { ADD_FROM_TEMPLATE_MSG } from '../../../consts/message-types'
import type { Tool } from '../../components'

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

  constructor(options: SystemOptions) {
    const { messageBus, sceneContext } = options

    this.messageBus = messageBus
    this.sceneContext = sceneContext

    this.mainObject = sceneContext.data.mainObject as GameObject
  }

  private handleAddMessages(): void {
    const messages = this.messageBus.get(ADD_FROM_TEMPLATE_MSG)
    if (!messages?.length) {
      return
    }

    const { x, y } = messages.at(-1) as MouseInputMessage

    const toolObjectId = this.sceneContext.data.currentToolObjectId as string
    const toolObject = this.mainObject.getChildById(toolObjectId) as GameObject
    const toolComponent = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

    const templateName = toolComponent.features.templateId.value

    // TODO: Implement game object creation
  }

  update(): void {
    this.handleAddMessages()
  }
}
