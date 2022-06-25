import {
  System,
  SystemOptions,
  GameObject,
  MessageBus,
  Camera,
  SceneContext,
} from 'remiz'

import { CAMERA_ZOOM_MSG, SELECT_LEVEL_MSG } from '../../../consts/message-types'
import type { SelectLevelMessage } from '../../../types/messages'
import type { Tool } from '../../components'

const CAMERA_COMPONENT_NAME = 'camera'
const TOOL_COMPONENT_NAME = 'tool'
const ZOOM_FACTOR = 1.5
const DEFAULT_ZOOM = 1

type ZoomMode = 'in' | 'out'

export class ZoomToolSystem implements System {
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private mainObject: GameObject

  constructor(options: SystemOptions) {
    const {
      messageBus,
      sceneContext,
    } = options

    this.messageBus = messageBus
    this.sceneContext = sceneContext

    this.mainObject = sceneContext.data.mainObject as GameObject
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined

    if (!messages) {
      return
    }

    const cameraComponent = this.mainObject.getComponent(CAMERA_COMPONENT_NAME) as Camera
    cameraComponent.zoom = DEFAULT_ZOOM
  }

  update(): void {
    this.handleLevelChange()

    const zoomMessages = (this.messageBus.get(CAMERA_ZOOM_MSG) || [])

    if (!zoomMessages.length) {
      return
    }

    const toolObjectId = this.sceneContext.data.currentToolObjectId as string
    const toolObject = this.mainObject.getChildById(toolObjectId) as GameObject
    const toolComponent = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

    const zoomMode = toolComponent.features.direction.value as ZoomMode

    const cameraComponent = this.mainObject.getComponent(CAMERA_COMPONENT_NAME) as Camera

    if (zoomMode === 'in') {
      cameraComponent.zoom *= ZOOM_FACTOR
    } else {
      cameraComponent.zoom /= ZOOM_FACTOR
    }
  }
}
