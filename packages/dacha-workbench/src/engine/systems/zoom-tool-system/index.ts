import {
  System,
  SystemOptions,
  GameObject,
  MessageBus,
  Camera,
  SceneContext,
} from 'remiz'

import { CAMERA_ZOOM_MSG } from '../../../consts/message-types'
import type { Tool } from '../../components'

const CAMERA_COMPONENT_NAME = 'camera'
const TOOL_COMPONENT_NAME = 'tool'
const ZOOM_FACTOR = 1.5

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

  update(): void {
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
